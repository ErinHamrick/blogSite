// schemas/typedefs.js

// const { gql } = require('apollo-server');

const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    # Add other user fields as needed
  }

  type BlogPost {
    _id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment]!
    # Add other blog post fields as needed
  }

  type Comment {
    _id: ID!
    content: String!
    user: User!
    createdAt: String!
    # Add other comment fields as needed
  }

  type Query {
    getUser(userId: ID!): User
    getBlogPost(postId: ID!): BlogPost
    # Add other queries as needed
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    createBlogPost(title: String!, content: String!): BlogPost
    createComment(postId: ID!, content: String!): Comment
    # Add other mutations as needed
  }
`;

module.exports = typeDefs;
