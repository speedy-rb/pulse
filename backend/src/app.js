const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const connectPgSimple = require('connect-pg-simple');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

require('dotenv').config({
    path: process.env.ENV_FILE || path.join(__dirname, "../.env"),
})

const pool = require('./db/pool');
const db = require('./db/queries');
const app = express();

if (process.env.NODE_ENV === 'dev') {
    app.use(cors({
        origin: 'http://localhost:5173'
    }));
}
app.use(express.json());
app.use('/uploads', express.static(process.env.UPLOADS_DIR));
const storage = multer.diskStorage({
    destination: process.env.UPLOADS_DIR,
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});
const upload = multer({ storage });

const PgSession = connectPgSimple(session);
app.use(session({
    store: new PgSession({
        pool,
        tableName: 'user_sessions',
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 30,
    },
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query(
                `
                    SELECT id, email, password_hash
                    FROM users
                    WHERE email = $1
                `,
                [username]
            );
            const user = rows[0];
            if (!user) { return done(null, false); }
            const passwordMatches = await bcrypt.compare(
                password,
                user.password_hash
            );
            if (!passwordMatches) { return done(null, false); }
            return done(null, {
                id: user.id,
                email: user.email,
            });
        } catch (err) { return done(err); }
    })
);
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query(`
            SELECT id, email
            FROM users
            WHERE id = $1
        `, [id]);
        const user = rows[0];
        if (!user) { return done(null, false); }
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json({
        user: {
            id: req.user.id,
            email: req.user.email,
        },
    });
});

app.get('/api/me', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ user: null });
    }
    res.json({
        user: {
            id: req.user.id,
            email: req.user.email,
        },
    });
});

app.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) { return next(err); }
            res.clearCookie('connect.sid');
            res.sendStatus(204);
        });
    });
});

function requireAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
}

app.use('/api', requireAuth);

async function getPostForDate(req, res) {
    const { date } = req.query; // '2026-04-04'
    const userId = req.user.id;
    if (!date) {
        return res.status(400).json({
            error: 'Missing required query paramter: date'
        });
    }
    const obj = await db.getPostForDate(date, userId);
    res.json(obj);
}

app.get('/api/posts', (req, res) => {
    console.log('hit');
    getPostForDate(req, res);
});

async function createNewPost(req, res) {
    const { notes, location, postDate } = req.body;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'Image is required' });
    }
    const post = {
        userId: req.user.id,
        imagePath: `/${file.filename}`,
        postDate: postDate,
        location: location || null,
        notes: notes || null,
    };
    console.log(post);
    const result = await db.createNewPost(post);
    res.status(201).json(result[0]);
}

app.post('/api/posts', upload.single('image'), (req, res) => {
    createNewPost(req, res);
})

async function updatePostController(req, res) {
    const post = {
        id: req.params.id,
        userId: req.user.id,
        imagePath: req.file ? `/${req.file.filename}` : null,
        postDate: req.body.postDate,
        location: req.body.location,
        notes: req.body.notes,
    };
    const rows = await db.updatePost(post);
    res.json(rows);
}
app.patch('/api/posts/:id', upload.single('image'), (req, res) => {
    updatePostController(req, res);
});


const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`backend listening on port ${PORT}`);
});