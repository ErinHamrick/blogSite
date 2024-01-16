// LogoutButton.jsx
import React from 'react';
import AuthService from '../utils/auth';

const LogoutButton = () => {
  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
