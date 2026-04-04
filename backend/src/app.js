const express = require('express');
const cors = require('cors');
const db = require('./db/queries');

const path = require('path');
require('dotenv').config({
    path: process.env.ENV_FILE || path.join(__dirname, "../.env"),
})

const app = express();

if (process.env.NODE_ENV === 'dev') {
    app.use(cors({
        origin: 'http://localhost:5173'
    }));
}

app.use('/uploads', express.static(process.env.UPLOADS_DIR));

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

app.get('/posts', (req, res) => {
    console.log('hit');
    getPostForDate(req, res);
});

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`backend listening on port ${PORT}`);
});