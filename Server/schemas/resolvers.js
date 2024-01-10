// resolvers.js

const { BlogPost, Comment, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
// const { GraphQLError } = require('graphql');
// const { ApolloServerErrorCode } = require('@apollo/server/errors');
const { secret, expiration } = require('../utils/auth');
const { db, mongoose } = require('../config/connection');

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
		updateBlogPost: async (_, { postId, title, content }) => {
			try {
				const updatedPost = await BlogPost.findByIdAndUpdate(
					postId,
					{ title, content },
					{ new: true }
				);
				return updatedPost;
			} catch (error) {
				throw new Error(`Error updating blog post: ${error.message}`);
			}
		},
		createComment: async (_, { postId, content, userId }) => {
			try {
				const userObjectId = new mongoose.Types.ObjectId(userId);
				// Assume you have a user ID available in the context (e.g., from authentication)
				const newComment = new Comment({
					content,
					user: userObjectId, // Set the user field using the provided userId
					blogPost: postId,
				});

				const savedComment = await newComment.save();
				return savedComment;
			} catch (error) {
				console.error('Error creating comment:', error);
				throw new Error(`Error creating comment: ${error.message}`);
			}
		},

		updateComment: async (_, { commentId, content }) => {
			try {
				const updatedComment = await Comment.findByIdAndUpdate(
					commentId,
					{ content },
					{ new: true }
				);
				return updatedComment;
			} catch (error) {
				throw new Error(`Error updating comment: ${error.message}`);
			}
		},
		deleteComment: async (_, { commentId }) => {
			try {
				const deletedComment = await Comment.findByIdAndDelete(commentId);
				if (!deletedComment) {
					return { success: false, message: 'Comment not found' };
				}
				return { success: true, message: 'Comment successfully deleted' };
			} catch (error) {
				throw new Error(`Error deleting comment: ${error.message}`);
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
