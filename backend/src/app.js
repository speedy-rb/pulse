const express = require('express');
const cors = require('cors');
const db = require('./db/queries');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: process.env.ENV_FILE || path.join(__dirname, "../.env"),
})

const app = express();

if (process.env.NODE_ENV === 'dev') {
    app.use(cors({
        origin: 'http://localhost:5173'
    }));
}

app.use('/uploads', express.static(process.env.UPLOADS_DIR));

app.get('/', (req, res) => 
    res.send("hello world")
);

async function getPostForDate(req, res) {
    // const date = '2026-04-04';
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({
            error: 'Missing required query paramter: date'
        });
    }
    const obj = await db.getPostForDate(date);
    res.json(obj);
}

app.get('/posts', (req, res) => {
    getPostForDate(req, res);
});

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`backend listening on port ${PORT}`);
});