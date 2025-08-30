const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const app = express();

app.get('/api/index', (req, res) => {
    res.json({ message: "Hello from Express v2 👋" });
});

app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
});