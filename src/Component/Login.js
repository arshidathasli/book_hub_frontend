import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);

        const decodedToken = jwtDecode(data.access);
        console.log(decodedToken.role);
        localStorage.setItem('role', decodedToken.role);

        // Redirect based on role
        if (decodedToken.role === 'patron') {
        window.location.href = '/patron_Page';
          console.log('Navigate to /patron_Page');
        } else if (decodedToken.role === 'librarian' || decodedToken.role === 'head_librarian') {
            window.location.href = ('/librarian_Page'); // Ensure correct case and path
        }
      } else {
        console.log('Login failed');
        // Handle login failure
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p style={{ paddingBottom: 20, paddingLeft: 100 }}>
        <b>Don't have an account?</b> <Link to="/signup">Signup Here</Link>
      </p>
    </div>
  );
}

export default Login;
