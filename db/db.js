const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blog');

// console logging our messages to see what's happening
mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected')
});

mongoose.connection.on('error', (err) => {
  console.log(err, ' Mongoose failed to connect')
});

mongoose.connection.on('disconnected', () => {
  console.log(' Mongoose is disconnected')
});
