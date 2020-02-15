const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('API is running'));

app.listen(PORT, () => console.log(`Server has been Start at Port ${PORT}`));
