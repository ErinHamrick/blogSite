// resolvers.js

const { BlogPost, Comment, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const { ApolloServerErrorCode } = require('@apollo/server/errors');
const { secret, expiration } = require('../utils/auth');

const resolvers = {
	Query: {
		getUser: async (_, { userId }) => {
			try {
				return await User.findById(userId);
			} catch (error) {
				console.error('Error fetching user:', error);
				throw new Error(`Error fetching user: ${error.message}`);
			}
		},
		getAllUsers: async () => {
			try {
				const users = await User.find();
				if (users.some((user) => user.username == null)) {
					console.error('Error: Some users have null usernames');
				}
				return users;
			} catch (error) {
				console.error('Error fetching users:', error);
				throw new Error(`Error fetching users: ${error.message}`);
			}
		},
		getBlogPost: async (_, { postId }) => {
			return await BlogPost.findById(postId)
				.populate('author')
				.populate('comments')
				.select('_id title content author comments createdAt');
		},
		getAllPosts: async () => {
			try {
				const allPosts = await BlogPost.find();
				return allPosts;
			} catch (error) {
				console.error('Error fetching all posts:', error);
				throw new Error(`Error fetching all posts: ${error.message}`);
			}
		},
		me: async (_, args, context) => {
			try {
				if (context.user) {
					return await User.findOne({ _id: context.user._id });
				}
				throw new AuthenticationError('User not authenticated');
			} catch (error) {
				console.error(error);
				throw new Error('Failed to fetch user');
			}
		},
	},
	Mutation: {
		login: async (_, { username, password }) => {
			try {
				const user = await User.findOne({ username });

				if (!user) {
					throw new AuthenticationError('User not found');
				}

				const isCorrectPassword = await user.isCorrectPassword(password);

				if (!isCorrectPassword) {
					throw new AuthenticationError('Invalid password');
				}

				// Use the signToken function to generate a token for the authenticated user
				const token = signToken({
					email: user.email,
					username: user.username,
					_id: user._id,
				});

				return { user, token };
			} catch (error) {
				throw new Error(`Error during login: ${error.message}`);
			}
		},

		createUser: async (_, { username, email, password }) => {
			try {
				const newUser = new User({ username, email, password });
				const user = await newUser.save();

				// Use the signToken function to generate a token for the new user
				const token = signToken({
					email: user.email,
					username: user.username,
					_id: user._id,
				});

				// Return both the user and the token in the response
				return { user, token };
			} catch (error) {
				throw new Error(`Error creating user: ${error.message}`);
			}
		},
		createBlogPost: async (_, { title, content, username }, context) => {
			try {
				const user = await User.findOne({ username });
				if (!user) {
					throw new Error('User not found');
				}
				const newBlogPost = new BlogPost({
					title,
					content,
					author: user._id,
					createdAt: dayjs().format(),
				});
				const savedBlogPost = await newBlogPost.save();
				return savedBlogPost;
			} catch (error) {
				throw new Error(`Error creating blog post: ${error.message}`);
			}
		},
		createComment: async (_, { postId, content, userId }) => {
			try {
			  // Assume you have a user ID available in the context (e.g., from authentication)
			  const newComment = new Comment({
				content,
				user: userId,  // Set the user field using the provided userId
				blogPost: postId,
			  });
		
			  const savedComment = await newComment.save();
			  return savedComment;
			} catch (error) {
			  console.error('Error creating comment:', error);
			  throw new Error(`Error creating comment: ${error.message}`);
			}
		  },
		deleteUser: async (_, { userId }) => {
			try {
				const deletedUser = await User.findByIdAndDelete(userId);
				if (!deletedUser) {
					return {
						success: false,
						message: 'User not found or already deleted',
					};
				}
				return { success: true, message: 'User successfully deleted' };
			} catch (error) {
				throw new Error(`Error deleting user: ${error.message}`);
			}
		},
		deleteBlogPost: async (_, { postId }) => {
			try {
				const deletedPost = await BlogPost.findByIdAndDelete(postId);
				if (!deletedPost) {
					return { success: false, message: 'Blog post not found' };
				}
				return { success: true, message: 'Blog post successfully deleted' };
			} catch (error) {
				console.error('Error deleting blog post:', error);
				throw new Error(`Error deleting blog post: ${error.message}`);
			}
		},
	},
	BlogPost: {
		author: async (parent) => {
			const blogPost = await BlogPost.findById(parent._id).populate(
				'author',
				'username'
			);
			if (!blogPost || !blogPost.author) {
				return null;
			}
			return blogPost.author.username;
		},
		comments: async (parent) => {
			return await Comment.find({ blogPost: parent._id });
		},
	},
	Comment: {
		user: async (parent) => {
			return await User.findById(parent.user);
		},
	},
};

module.exports = resolvers;

// const { BlogPost, Comment, User } = require('../models');
// const {signToken, AuthenticationError} = require('../utils/auth')
// const dayjs = require('dayjs');
// const { secret, expiration } = require('../utils/auth');
// const jwt = require('jsonwebtoken');
// const { GraphQLError } = require("graphql");
// const { ApolloServerErrorCode } = require("@apollo/server/errors");
// // const bcrypt = require('bcrypt');

// const resolvers = {
// 	Query: {
// 		getUser: async (_, { userId }) => {
// 			return await User.findById(userId);
// 		},
// 		getAllUsers: async () => {
// 			try {
// 				const users = await User.find();

// 				// Log the users' data
// 				// console.log('Users:', users);

// 				// Check if any user has a null username
// 				if (users.some((user) => user.username == null)) {
// 					console.error('Error: Some users have null usernames');
// 				}

// 				return users;
// 			} catch (error) {
// 				console.error('Error fetching users:', error);
// 				throw new Error(`Error fetching users: ${error.message}`);
// 			}
// 		},
// 		getBlogPost: async (_, { postId }) => {
// 			return await BlogPost.findById(postId)
// 				.populate('author')
// 				.populate('comments')
// 				.select('_id title content author comments createdAt');
// 		},
// 		getAllPosts: async () => {
// 			try {
// 				const allPosts = await BlogPost.find();
// 				return allPosts;
// 			} catch (error) {
// 				console.error('Error fetching all posts:', error);
// 				throw new Error(`Error fetching all posts: ${error.message}`);
// 			}
// 		},
// 	},
// 	Mutation: {
// 		createUser: async (_, { username, email, password }) => {
// 			try {
// 				const newUser = new User({ username, email, password });
// 				return await newUser.save();
// 			} catch (error) {
// 				throw new Error(`Error creating user: ${error.message}`);
// 			}
// 		},
// 		login: async (_, { username, password }) => {
// 			try {
// 				// Find the user by username
// 				const user = await User.findOne({ username });

// 				if (!user) {
// 					throw new AuthenticationError('User not found');
// 				}

// 				// Validate the password using bcrypt
// 				const isCorrectPassword = await user.isCorrectPassword(password);

// 				if (!isCorrectPassword) {
// 					throw new AuthenticationError('Invalid password');
// 				}

// 				// Generate a token using the imported secret and expiration values
// 				const token = jwt.sign(
// 					{ userId: user._id, username: user.username },
// 					secret,
// 					{ expiresIn: expiration }
// 				);

// 				// Return the token in the response
// 				return { token };
// 			} catch (error) {
// 				throw new Error(`Error during login: ${error.message}`);
// 			}
// 		},

// 		createBlogPost: async (_, { title, content, username }, context) => {
// 			try {
// 				// Find the user by username
// 				const user = await User.findOne({ username });

// 				if (!user) {
// 					throw new Error('User not found');
// 				}

// 				// Use the user's ID as the author of the blog post
// 				const newBlogPost = new BlogPost({
// 					title,
// 					content,
// 					author: user._id,
// 					createdAt: dayjs().format(),
// 				});
// 				const savedBlogPost = await newBlogPost.save();
// 				return savedBlogPost;
// 			} catch (error) {
// 				throw new Error(`Error creating blog post: ${error.message}`);
// 			}
// 		},
// 		createComment: async (_, { postId, content }, context) => {
// 			// Assume you have a user ID available in the context (e.g., from authentication)

// 			const userId = context.userId; // Adjust based on your actual authentication method
// 			console.log('Context User ID:', context.user);
// 			const newComment = new Comment({
// 				content,
// 				user: userId,
// 				blogPost: postId,
// 			});
// 			return await newComment.save();
// 		},
// 		// Add other mutation resolvers as needed
// 		deleteUser: async (_, { userId }) => {
// 			try {
// 				// Find the user by userId and delete it
// 				const deletedUser = await User.findByIdAndDelete(userId);

// 				// Check if the user was found and deleted
// 				if (!deletedUser) {
// 					return {
// 						success: false,
// 						message: 'User not found or already deleted',
// 					};
// 				}

// 				return { success: true, message: 'User successfully deleted' };
// 			} catch (error) {
// 				throw new Error(`Error deleting user: ${error.message}`);
// 			}
// 		},
// 		deleteBlogPost: async (_, { postId }) => {
// 			try {
// 				const deletedPost = await BlogPost.findByIdAndDelete(postId);

// 				if (!deletedPost) {
// 					return { success: false, message: 'Blog post not found' };
// 				}

// 				return { success: true, message: 'Blog post successfully deleted' };
// 			} catch (error) {
// 				console.error('Error deleting blog post:', error);
// 				throw new Error(`Error deleting blog post: ${error.message}`);
// 			}
// 		},
// 	},
// 	BlogPost: {
// 		author: async (parent) => {
// 			// Populate the author field to include the username
// 			const blogPost = await BlogPost.findById(parent._id).populate(
// 				'author',
// 				'username'
// 			);

// 			if (!blogPost || !blogPost.author) {
// 				return null; // Return null or handle the case where author information is not available
// 			}

// 			return blogPost.author.username;
// 		},
// 		comments: async (parent) => {
// 			return await Comment.find({ blogPost: parent._id });
// 		},
// 		// Add other field resolvers as needed
// 	},
// 	Comment: {
// 		user: async (parent) => {
// 			return await User.findById(parent.user);
// 		},
// 		// Add other field resolvers as needed
// 	},
// };

// module.exports = resolvers;
