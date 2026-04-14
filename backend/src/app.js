const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config({
    path: process.env.ENV_FILE || path.join(__dirname, "../.env"),
})

const db = require('./db/queries');
const app = express();

if (process.env.NODE_ENV === 'dev') {
    app.use(cors({
        origin: 'http://localhost:5173'
    }));
}

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

async function getPostForDate(req, res) {
    const { date } = req.query; // '2026-04-04'
    if (!date) {
        return res.status(400).json({
            error: 'Missing required query paramter: date'
        });
    }
    const obj = await db.getPostForDate(date);
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

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`backend listening on port ${PORT}`);
});