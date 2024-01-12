// Login.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations'; // Make sure to import your actual mutation
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [login, { loading, error }] = useMutation(LOGIN, {
    // Define the LOGIN mutation
    // Ensure you handle loading and error states appropriately
    onCompleted: (data) => {
      // Handle successful login, e.g., redirect to the user's dashboard
      console.log('Login successful:', data);
      navigate('/blogposts')
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Call the login mutation with the form data
    login({ variables: { ...formData } });
  };

  return (
    <div className='container login'>
      <h2 className='login-label'>Login</h2>
      <form id='login-form' onSubmit={handleLogin}>
        <label >
          Username:
          <input type="text" name="username" onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" onChange={handleInputChange} />
        </label>
        <button className='login-button' type="submit" disabled={loading}>
          Login
        </button>
        {error && <p>Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default Login; 