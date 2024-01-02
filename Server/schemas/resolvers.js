// resolvers.js

const { BlogPost, Comment, User } = require('../models'); 

const resolvers = {
  Query: {
    getUser: async (_, { userId }) => {
      return await User.findById(userId);
    },
    getBlogPost: async (_, { postId }) => {
      return await BlogPost.findById(postId).populate('author').populate('comments');
    },
    // Add other query resolvers as needed
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      const newUser = new User({ username, email, password });
      return await newUser.save();
    },
    createBlogPost: async (_, { title, content }, context) => {
      // Assume you have a user ID available in the context (e.g., from authentication)
      const userId = context.userId; // Adjust based on your actual authentication method

      const newBlogPost = new BlogPost({ title, content, author: userId });
      return await newBlogPost.save();
    },
    createComment: async (_, { postId, content }, context) => {
      // Assume you have a user ID available in the context (e.g., from authentication)
      const userId = context.userId; // Adjust based on your actual authentication method

      const newComment = new Comment({ content, user: userId, blogPost: postId });
      return await newComment.save();
    },
    // Add other mutation resolvers as needed
  },
  BlogPost: {
    author: async (parent) => {
      return await User.findById(parent.author);
    },
    comments: async (parent) => {
      return await Comment.find({ blogPost: parent._id });
    },
    // Add other field resolvers as needed
  },
  Comment: {
    user: async (parent) => {
      return await User.findById(parent.user);
    },
    // Add other field resolvers as needed
  },
};

module.exports = resolvers;
