import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './reset.css'
import './index.css'
// import './App.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/HomePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import BlogPostsPage from './pages/BlogpostsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: '/blogposts',
				element: <BlogPostsPage />,
			},
			{
				path: '/profile/:username',
				element: <ProfilePage />
			}
		],
	},
]);

//manually define routes for pages

ReactDOM.createRoot(document.getElementById('root')).render(
	<RouterProvider router={router} />
);