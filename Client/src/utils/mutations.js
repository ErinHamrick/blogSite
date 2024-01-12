// mutations.js

import { gql } from '@apollo/client';

export const LOGIN= gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        _id
        username
        email
      }
      token
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user {
        _id
        username
        email
      }
      token
    }
  }
`;

export const CREATE_BLOG_POST = gql`
  mutation CreateBlogPost($title: String!, $content: String!, $username: String!) {
    createBlogPost(title: $title, content: $content, username: $username) {
      _id
      title
      content
      createdAt
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $content: String!, $userId: ID!) {
    createComment(postId: $postId, content: $content, userId: $userId) {
      _id
      content
      createdAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      success
      message
    }
  }
`;

export const DELETE_BLOG_POST = gql`
  mutation DeleteBlogPost($postId: ID!) {
    deleteBlogPost(postId: $postId) {
      success
      message
    }
  }
`;
