const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
});