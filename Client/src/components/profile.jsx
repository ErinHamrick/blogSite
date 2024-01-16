// Profile.jsx
import React from 'react';

const Profile = ({ username, blogPosts }) => {
  return (
    <div>
      <h2>{username}'s Profile</h2>
      <div>
        <h3>My Blog Posts</h3>
        {blogPosts.map((post) => (
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

export default Profile;
