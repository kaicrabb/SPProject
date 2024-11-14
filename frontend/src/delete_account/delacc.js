// src/delacc/DelAcc.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DelAcc() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState(''); // New state for confirm password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // Account Deletion Handler
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!username || !password || !conPassword) {
      setError('Username, password, and confirm password are required');
      return;
    }

    if (password !== conPassword) {
      setError('Password and confirm password do not match');
      return;
    }

    try {
      // Send DELETE request to backend API
      const response = await fetch('http://localhost:5000/deleteAccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, Password: password }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Account deleted successfully!');
        alert('Account deleted successfully!');
        setUsername('');
        setPassword('');
        setConPassword('');
        navigate('/signup');  // Redirect after deletion
      } else {
        setError(result.message || 'Failed to delete account');
      }
    } catch (err) {
      setError('An error occurred while deleting the account.');
    }
  };

  return (
    <div>
      <h2>Delete Account</h2>
      <form onSubmit={handleDeleteAccount}>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={conPassword}
          onChange={(e) => setConPassword(e.target.value)}
        />
        <button type="submit">Delete Account</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default DelAcc;
