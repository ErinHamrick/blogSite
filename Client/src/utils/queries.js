// queries.js
import { gql } from '@apollo/client';

// Query to get a user by ID
export const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      _id
      username
      email
      blogPosts {
        _id
        title
        content
        createdAt
      }
    }
  }
`;

// Query to get all users
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      _id
      username
      email
      blogPosts {
        _id
        title
        content
        createdAt
      }
    }
  }
`;
// Query to get a blog post by ID
export const GET_BLOG_POST = gql`
  query GetBlogPost($postId: ID!) {
    getBlogPost(postId: $postId) {
      _id
      title
      content
      author
      comments {
        _id
        content
        user {
          _id
          username
        }
        createdAt
      }
      createdAt
    }
  }
`;

// Query to get all blog posts
export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    getAllPosts {
      _id
      title
      content
      author
      comments {
        _id
        content
        user {
          _id
          username
        }
        createdAt
      }
      createdAt
    }
  }
`;

// Query to get authenticated user


export const GET_AUTHENTICATED_USER = gql`
  query Me {
    me {
      _id
      username
      email
      blogPosts {
        _id
        title
        content
        createdAt
      }
    }
  }
`;

// Add more queries as needed
