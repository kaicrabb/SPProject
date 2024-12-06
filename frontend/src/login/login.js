import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCharacterImages } from '../game/fetch_character'; // grab the character sprites to preload them for the game

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate(); // Set up navigation

    // Set up design elements
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Silkscreen&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const style = document.createElement('style');
        style.innerHTML = `
            input::placeholder {
                font-family: 'Silkscreen', cursive !important;
                color: #888;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(link);
            document.head.removeChild(style);
        };
    }, []);

    // Set up handling the login
    const handleLogin = async (e) => {
        e.preventDefault();
    
        // Check that both username and password are inputted
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }
    
        // Username validation: only letters, numbers, and underscores
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
    
        // Password validation: at least 8 characters, one symbol, one uppercase, one lowercase
        // Handled on server side

        if (!usernameRegex.test(username)) { // Check that username matches the regex case
            setError('Username can only contain letters, numbers, and underscores.');
            return;
        }
        
        // Try to log the user in
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Username: username, Password: password }),
            });

            // Await the backend response
            const result = await response.json();
    
            // If response is good log the user in
            if (response.ok) {
                const token = result.token;
                localStorage.setItem('token', token); // store the users token
                localStorage.setItem('username', result.Username); // store the users username in local storage
    
                // Preload character images
                try {
                    await getCharacterImages(token); 
                    console.log('Character images preloaded successfully!');
                } catch (err) {
                    console.error('Error preloading character images:', err);
                }
    
                // Check if the account uses legacy passwords ( if the account was made before regex was added)
                if (result.passwordStrength === 'legacy') {
                    alert(
                        'Your account is using an old password. Please update your password for enhanced security.'
                    );
                    navigate('/update-password'); // Redirect to password update page
                } else { // Log the user 
                    setSuccess('Login successful!');
                    alert('Login Successful!'); // tell the user that login was successful
                    setUsername(''); // get rid of input in fields
                    setPassword(''); // get rid of input in fields
                    navigate('/game'); // log the user in
                }
            } else { // Error out without telling them why that username or password didn't work
                setError(result.message || 'Invalid username or password');
            }
        } catch (err) { // Catch unexpected errors
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
                        color: 'black',
                        fontFamily: 'Silkscreen',
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        color: 'black',
                        fontFamily: 'Arial, sans-serif',
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
