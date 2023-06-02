const crypto = require('crypto');
const cors = require('cors');

// Generate a random secret key
const secret = crypto.randomBytes(32).toString('hex');

// Set up the environment variables
process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost:27017/forum';
process.env.JWT_SECRET = secret;

// Load the environment variables
require('dotenv').config();

// Require the necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// Set up the Express app
const app = express();
const apiVersion = process.env.apiVersion || 'v1';

app.use('/uploads', express.static('uploads'));


app.use(cors());

// Set up the middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Require the API routes
const authRoutes = require('./src/routes/authRoutes');
const forumRoutes = require('./src/routes/forumRoutes');

// Set up the API routes
app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/forum`, forumRoutes);

// Set up the MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', error => console.log(error));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// Start the server
app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
