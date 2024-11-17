import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile({ selectedImage, setSelectedImage }) {
  const [userInfo, setUserInfo] = useState(null);  // Store user information
  const [error, setError] = useState('');  // For handling errors
  const navigate = useNavigate();

  const profileImages = [
    '/profileicons/profiledefault.png',
    '/profileicons/profilecreeps.png',
    '/profileicons/profileflat.png',
    '/profileicons/profileflat2.png',
    '/profileicons/profileoh.png',
    '/profileicons/profileshades.png',
    '/profileicons/profilesmiley.png',
    '/profileicons/profilesurprise.png',
  ];


  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Silkscreen&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  
    return () => {
      document.head.removeChild(link);
    };
  }, []);  

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

  const handleImageChange = (e) => {
    const selected = e.target.value;
    setSelectedImage(selected); // Update the App-level state instantly
    localStorage.setItem('profileImage', selected); // Save to localStorage
  };
  

  return (
    <div>
      <h2 style={{ fontFamily: 'Silkscreen', textAlign: 'center', color: 'white' }}>User Profile</h2>
      {error && <p style={{ color: 'white', fontFamily: 'Silkscreen' }}>{error}</p>}
      {userInfo ? (
        <div style={{ fontFamily: 'Silkscreen', color: 'white' }}>

          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>HighScore:</strong> {userInfo.score}</p>
          <p><strong>Joined:</strong> {userInfo.joined}</p>

          <div>
            <label htmlFor="profile-image" style={{ display: 'block', margin: '10px 0' }}>
              Select Profile Image:
            </label>
            <select id="profileImage" value={selectedImage} onChange={handleImageChange}>
              {profileImages.map((image, index) => {const imageName = image
                .split('/')
                .pop()
                .replace('profile', '')
                .replace('.png', '');
                return (<option key={index} value={image}>
                  {imageName.charAt(0).toUpperCase() + imageName.slice(1)}
                  </option>
                );
              })}
            </select>

          </div>
          <button onClick={handleLogout} style={{ fontFamily: 'Silkscreen', color: 'black' }}>
            Logout
          </button>
        </div>
      ) : (
        <p style={{ fontFamily: 'Silkscreen', color: 'white' }}>Loading user information...</p>
      )}
    </div>
  );
}


export default Profile;
