import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdatePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // Set up navigation
    const token = localStorage.getItem('token');  // Retrieve the token from local storage

    // Password validation function
    const validatePassword = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    };

    // Handle password updates
    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        // Make sure all fields are inputted
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }
    
        // Make sure that the new password matches in both its fields
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password must match');
            return;
        }
    
        // Make sure new password meets regex requirements
        if (!validatePassword(newPassword)) {
            setError('New password does not meet the requirements (min 8 characters, 1 symbol, 1 uppercase, 1 lowercase)');
            return;
        }

        // Try to update the password
        try { // Fetch the backend
            const response = await fetch('http://localhost:5000/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                }),
            });

            // Await backend response
            const result = await response.json();
    
            // If response is okay send user on their way and clear input fields
            if (response.ok) {
                setSuccess('Password updated successfully!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    navigate('/game');  // Redirect after successful update
                }, 2000);
            } else { // check for errors on backend side
                setError(result.message || 'An error occurred while updating the password');
            }
        } catch (err) { // check for unexpected errors
            setError('An error occurred while updating the password');
        }
    };

    return (
        <div style={{ fontFamily: 'Silkscreen', textAlign: 'center' }}>
            <h2 style={{ color: 'white' }}>Update Your Password</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto' }}>
                <div>
                    <label style={{ color: 'white' }}>Old Password:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        style={{ padding: '5px', margin: '5px 0' }}
                    />
                </div>
                <div>
                    <label style={{ color: 'white' }}>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ padding: '5px', margin: '5px 0' }}
                    />
                </div>
                <div>
                    <label style={{ color: 'white' }}>Confirm New Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ padding: '5px', margin: '5px 0' }}
                    />
                </div>
                <button type="submit" style={{ margin: '10px 0', padding: '10px', backgroundColor: 'blue', color: 'white' }}>Update Password</button>
            </form>
        </div>
    );
}

export default UpdatePassword;
