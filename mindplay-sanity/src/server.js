require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const sanityRoutes = require('./routes/sanityRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5001;

// try to connect to MongoDB, but gracefully fallback to in-memory if unavailable
async function start() {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection failed, continuing with in-memory store. Error:', err.message);
    }
  } else {
    console.log('No MONGO_URI set — using in-memory store (demo).');
  }

  app.get('/', (req, res) => res.send('MindPlay sanity service'));

  app.use('/api/sanity', sanityRoutes);

  app.listen(PORT, () => console.log(`Sanity service running on port ${PORT}`));
}

start();
