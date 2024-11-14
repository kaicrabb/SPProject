import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // For handling errors
  const [success, setSuccess] = useState('');  // For showing success messages

  const navigate = useNavigate();

  useEffect(() => {
    // Step 1: Dynamically inject the Google Font into the document
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
        <button type="submit">Sign Up</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default SignUp;
