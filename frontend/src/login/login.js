import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCharacterImages } from '../game/fetch_character';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

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

    const handleLogin = async (e) => {
        e.preventDefault();
    
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }
    
        // Username validation: only letters, numbers, and underscores
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
    
        // Password validation: at least 8 characters, one symbol, one uppercase, one lowercase
        //const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
        if (!usernameRegex.test(username)) {
            setError('Username can only contain letters, numbers, and underscores.');
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
                const token = result.token;
                localStorage.setItem('token', token);
                localStorage.setItem('username', result.Username);
    
                // Preload character images
                try {
                    await getCharacterImages(token);
                    console.log('Character images preloaded successfully!');
                } catch (err) {
                    console.error('Error preloading character images:', err);
                }
    
                // Check if the account uses legacy passwords
                if (result.passwordStrength === 'legacy') {
                    alert(
                        'Your account is using an old password. Please update your password for enhanced security.'
                    );
                    navigate('/update-password'); // Redirect to password update page
                } else {
                    setSuccess('Login successful!');
                    alert('Login Successful!');
                    setUsername('');
                    setPassword('');
                    navigate('/game');
                }
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
