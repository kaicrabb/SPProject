// src/login/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // For handling errors
  const [success, setSuccess] = useState('');  // For showing success messages

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      // Send POST request to backend API (Express)
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, Password: password }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Login successful!');
        setUsername('');
        setPassword('');
        navigate('/dashboard');  // Redirect to the dashboard or another page after login
      } else {
        setError(result.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred while logging in.');
    }
  };

  return (
    <div>
      <h2>Login Here!</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default Login;
