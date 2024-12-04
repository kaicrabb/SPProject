import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // For handling errors
  const [success, setSuccess] = useState('');  // For showing success messages

  const navigate = useNavigate();

  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

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
    // Username validation: only letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    // Password validation: at least 8 characters, one symbol, one uppercase, one lowercase
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!usernameRegex.test(username)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    try {
      // Send POST request to backend API (Express)
      const response = await fetch(`${backendURL}contact`, {
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
        const loginResponse = await fetch(`${backendURL}login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Username: username, Password: password }),
        });
        const loginResult = await loginResponse.json();

        if (loginResponse.ok) {
          // Store the token in local storage
          localStorage.setItem('token', loginResult.token);
          localStorage.setItem('username', result.Username);
          navigate('/CharacterSelect'); // Navigate to Character Select
        } else {
          setError(loginResult.message || 'Login failed after sign-up');
        }
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
