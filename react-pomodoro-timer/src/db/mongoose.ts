const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://root:root@cluster0.zxjlvog.mongodb.net/';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas...'))
  .catch(err => console.error('Could not connect to MongoDB Atlas:', err));