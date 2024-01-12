// ProfilePage.jsx

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_AUTHENTICATED_USER } from '../utils/queries';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { loading, error, data } = useQuery(GET_AUTHENTICATED_USER);
  const { userId } = useParams(); // Access the userId parameter from the URL

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { me } = data;

  return (
    <div>
      <h2>{me.username}'s Profile</h2>

      <div>
        <h3>My Blog Posts</h3>
        {me.blogPosts.map((post) => (
          <div key={post._id}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <p>Created At: {post.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;

