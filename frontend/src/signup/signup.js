// src/signup/signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // For handling errors
  const [success, setSuccess] = useState('');  // For showing success messages

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      // Send POST request to backend API (Express)
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, Password: password }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('User signed up successfully!');
        alert('Account Created!');
        setUsername('');
        setPassword('');
        navigate('/game');
        
      } else {
        setError(result.message || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred while signing up.');
    }
  };

  return (
    <div>
      <h2>Sign Up Here!</h2>
      <form onSubmit={handleSignup}>
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
        <button type="submit">Sign Up</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default SignUp;
