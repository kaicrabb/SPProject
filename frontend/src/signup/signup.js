import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // For handling errors
  const [success, setSuccess] = useState('');  // For showing success messages
  const navigate = useNavigate(); // For navigating to other pages

  // Set up the design elements
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

  // Set up Signing up for an account
  const handleSignup = async (e) => {
    e.preventDefault();

    // Check that neither the password nor the username fields are empty
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    // Username validation: only letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    // Password validation: at least 8 characters, one symbol, one uppercase, one lowercase
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!usernameRegex.test(username)) { // Check that the username matches our regex
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    if (!passwordRegex.test(password)) { // Check that the password matches our regex
      setError(
        'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    // Try to send the data out to the data base
    try {
      // Send POST request to backend API (Express)
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, Password: password }),
      });

      // Wait for a response
      const result = await response.json();

      // If response is good notify the user they were signed in
      if (response.ok) {
        setSuccess('User signed up successfully!');
        alert('Account Created!');
        setUsername('');
        setPassword('');
        
        // Automatically log the user in once they have signed up
        const loginResponse = await fetch('http://localhost:5000/login', {
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
        } else { //Check if login failed
          setError(loginResult.message || 'Login failed after sign-up');
        }
      } else { // Check for errors when response being made
        setError(result.message || 'Something went wrong');
      }
    } catch (err) { // check for errors that occured when sending data to database
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
