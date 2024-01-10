const mongoose = require('mongoose');

mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blogSite'
);

// module.exports = mongoose.connection;

// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/your-database-name', {

// });

const db = mongoose.connection;

db.on('error', (error) => {
	console.error('MongoDB connection error:', error);
});

db.once('open', () => {
	console.log('Connected to MongoDB');
});

module.exports = { db, mongoose };
