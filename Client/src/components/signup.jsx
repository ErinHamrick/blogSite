// SignUp.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom'
import { CREATE_USER } from '../graphql/../utils/mutations'; // Import the CREATE_USER mutation

const SignUp = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      // Handle successful signup, e.g., redirect to login page
      console.log('Signup successful:', data);
      navigate('/blogposts');
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    // Call the createUser mutation with the form data
    createUser({ variables: { ...formData } });
  };

  return (
    <div className='container'>
      <h2 className='login-label'>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <label>
          Username:
          <input type="text" name="username" onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" onChange={handleInputChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" onChange={handleInputChange} />
        </label>
        <button className='signup-button' type="submit" disabled={loading}>
          Sign Up
        </button>
        {error && <p>Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default SignUp;
