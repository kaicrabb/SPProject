import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DelAcc() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState(''); // New state for confirm password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // Set up navigation features

  // Account Deletion Handler
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    // Make sure all fields are inputted
    if (!username || !password || !conPassword) {
      setError('Username, password, and confirm password are required');
      return;
    }

    // make sure the password and confirmed password match
    if (password !== conPassword) {
      setError('Password and confirm password do not match');
      return;
    }

    // Try to delete the account
    try {
      // Send DELETE request to backend API
      const response = await fetch('http://localhost:5000/deleteAccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, Password: password }),
      });
      
      // Await backend response
      const result = await response.json();

      // If account was deleted notify user, send them back to signup
      if (response.ok) {
        setSuccess('Account deleted successfully!');
        alert('Account deleted successfully!');
        setUsername('');
        setPassword('');
        setConPassword('');
        navigate('/signup');  // Redirect after deletion
      } else { // If response failed to delete
        setError(result.message || 'Failed to delete account');
      }
    } catch (err) { // If fetching failed/unexpected errors
      setError('An error occurred while deleting the account.');
    }
  };

  // Set up design elements
  useEffect(() => {
    // Step 1: Dynamically inject Google Font into the document
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Silkscreen&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Step 2: Apply the font family to the input placeholders
    const style = document.createElement('style');
    style.innerHTML = `
      input::placeholder {
        font-family: 'Silkscreen', cursive !important;
        color: #888;  /* Optional: Adjust placeholder color */
      }
    `;
    document.head.appendChild(style);

    // Cleanup: Remove the injected elements when the component unmounts
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []); // Empty dependency array to run only once

  return (
    <div style={{ fontFamily: 'Silkscreen, sans-serif', textAlign: 'center', color:'white' }}>
      <h2>Delete Account</h2>
      <form onSubmit={handleDeleteAccount}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            color: 'black',  // Set input text color
            fontFamily: 'Silkscreen',  // Set font family for input text
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            color: 'black',  // Set input text color
            fontFamily: 'Silkscreen',  // Set font family for input text
          }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={conPassword}
          onChange={(e) => setConPassword(e.target.value)}
          style={{
            color: 'black',  // Set input text color
            fontFamily: 'Silkscreen',  // Set font family for input text
          }}
        />
        <button type="submit">Delete Account</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default DelAcc;
