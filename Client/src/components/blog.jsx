import React from 'react';

const BlogList = ({ blogPosts }) => {
  return (
    <div >
      {blogPosts.map((post) => (
        <div className='blog-container' key={post._id}>
          <h2 className='post-title'>{post.title}</h2>
          <p className='post-content'>{post.content}</p>
          {/* Add more details or components as needed */}
        </div>
      ))}
    </div>
  );
};

export default BlogList;
