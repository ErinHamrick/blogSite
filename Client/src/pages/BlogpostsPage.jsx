import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_POSTS } from '../utils/queries';
import BlogList from '../components/blog';
import Header from '../components/header';

const BlogPostsPage = () => {
	const { loading, error, data } = useQuery(GET_ALL_POSTS);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const blogPosts = data.getAllPosts;

	return (
		<main>
			<Header />
			<div>
				{/* <h1>All Blog Posts</h1> */}
				<BlogList blogPosts={blogPosts} />
			</div>
		</main>
	);
};

export default BlogPostsPage;
