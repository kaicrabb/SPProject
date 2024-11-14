import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [userInfo, setUserInfo] = useState(null);  // Store user information
  const [error, setError] = useState('');  // For handling errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Send GET request to backend API to retrieve user information
        const response = await fetch('http://localhost:5000/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`  // Include token in headers
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);  // Store user data
        } else {
          setError('Failed to load user information');
          navigate('/login');  // Redirect to login if the token is invalid
        }
      } catch (err) {
        setError('An error occurred while fetching user information.');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');  // Clear token on logout
    navigate('/dashboard');  // Redirect to dashboard page
  };

  return (
    <div>
      <h2>User Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userInfo ? (
        <div>
          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>HighScore: </strong> {userInfo.Score}</p>
          <p><strong>Joined:</strong> {new Date(userInfo.joinedDate).toLocaleDateString()}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}

export default Profile;
