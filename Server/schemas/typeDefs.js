// schemas/typedefs.js

// const { gql } = require('@apollo/server');


const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    blogPosts: [BlogPost]!
  }

  type BlogPost {
    _id: ID!
    title: String!
    content: String!
    author: String!
    comments: [Comment]!
    createdAt: String!
  }

  type Comment {
    _id: ID!
    content: String!
    user: User!
    blogPost: BlogPost!
    createdAt: String!
  }
  
  type AuthPayload {
    token: ID!
    user: User
  }

  type Query {
    getUser(userId: ID!): User
    getBlogPost(postId: ID!): BlogPost 
    getAllUsers: [User]
    getAllPosts: [BlogPost]
    me: User
    # Add other queries as needed
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
    createBlogPost(title: String!, content: String!, username: String!): BlogPost
    createComment(postId: ID!, content: String!, userId: ID!): Comment
    deleteUser(userId: ID!): DeleteResult
    deleteBlogPost(postId: ID!): DeleteResult
    # Add other mutations as needed
  }

  type DeleteResult {
    success: Boolean
    message: String
  }`;

module.exports = typeDefs;
