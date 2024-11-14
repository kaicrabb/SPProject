import React, { useState, useEffect } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, Password: password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        setSuccess('Login successful!');
        alert('Login Successful!');
        setUsername('');
        setPassword('');
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
          style={{
            color: 'black',   // Change the input text color
            fontFamily: 'Silkscreen',  // Set font family for the text inside the input
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            color: 'black',   // Change the input text color
            fontFamily: 'Arial, sans-serif',  // Set font family for the text inside the input
          }}
        />
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default Login;
