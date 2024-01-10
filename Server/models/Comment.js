const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
	content: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	blogPost: {
		type: Schema.Types.ObjectId,
		ref: 'BlogPost',
		required: true,
	},
	parentComment: {
		type: Schema.Types.ObjectId,
		ref: 'Comment',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
