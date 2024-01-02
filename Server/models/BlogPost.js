const { Schema, model } = require('mongoose');
const User = require('./user');


const blogPostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // You can add more fields as needed for your blog post model
});

const BlogPost = model('BlogPost', blogPostSchema);

module.exports = BlogPost;
