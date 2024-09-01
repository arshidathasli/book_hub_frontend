import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the local storage
    localStorage.clear();

    // Redirect to the login page
    navigate('/login');
  }, [navigate]);

  return (
    <div>Logging out...</div>
  );
};

export default Logout;
