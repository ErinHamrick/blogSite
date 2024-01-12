const jwt = require('jsonwebtoken');
require('dotenv').config();
const { GraphQLError } = require('graphql');

// const secret = process.env.JWT_SECRET;
const secret = 'mysecretssshhhhhhh';
const expiration = '6h';

module.exports = {
	AuthenticationError: new GraphQLError('Could not authenticate user.', {
		extensions: {
			code: 'UNAUTHENTICATED',
		},
	}),
	authMiddleware: function ({ req }) {
		let token =
			req.body.token || req.query.token || req.headers.authorization;

		if (req.headers.authorization) {
			token = token.split(' ').pop().trim();
		}

		if (!token) {
			console.log('token not found');
			return req;
		}

		try {
			const decoded = jwt.verify(token, secret, { maxAge: expiration });
			console.log('Decoded Token:', decoded);
			req.user = decoded.data;
		} catch (error) {
			console.log('Invalid token:', error.message);
		}

		console.log('Context User ID:', req.user); // Log the user data in the context
		return req;
	},
	signToken: function ({ email, username, _id }) {
		const payload = { email, username, _id };
		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
};
