const express = require('express');
const app = express();
const cors = require('cors');
const depositRoutes = require('./routes/depositRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/deposits', depositRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);





module.exports = app;
