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
  
  const handlegame = () => {
    navigate('/game')
  }

  const handleLogout = () => {
    localStorage.removeItem('token');  // Clear token on logout
    localStorage.removeItem('profileImage');  // Clear the selected profile image from localStorage
    setSelectedImage('/profileicons/profiledefault.png') // Set profile image back to default
    navigate('/dashboard');  // Redirect to dashboard page
  };

  const handleCharSelect = () =>{
    navigate('/CharacterSelect');
  };
  
  const handleChangePass = () =>{
    navigate('/update-password');
  };

  const handleDeleteAccount = () =>{
    navigate('/delete-account');
  };

  const handleImageChange = (e) => {
    const selected = e.target.value;
    setSelectedImage(selected); // Update the App-level state instantly
    localStorage.setItem('profileImage', selected); // Save to localStorage
  };

  const buttonStyle = {
    fontFamily: 'Silkscreen',
    color: 'black',
    padding: '10px 20px',  // Adjust padding for better spacing
    fontSize: '16px',       // Set the font size for consistency
    border: '2px solid #333',
    borderRadius: '5px',    // Slight rounding for style
    backgroundColor: '#f0f0f0',  // Background color
    cursor: 'pointer',
    marginBottom: '10px',    // Space between buttons vertically
    textAlign: 'center',     // Align text in the center
    display: 'inline-block', // Ensure button respects width/height
    width: '250px',          // Fixed width for all buttons
    height: '50px',          // Fixed height for consistency
    boxSizing: 'border-box',  // Ensure padding is included in the button dimensions
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
              {profileImages.map((image, index) => {
                const imageName = image
                  .split('/')
                  .pop()
                  .replace('profile', '')
                  .replace('.png', '');
                return (
                  <option key={index} value={image}>
                    {imageName.charAt(0).toUpperCase() + imageName.slice(1)}
                  </option>
                );
              })}
            </select>
          </div>

          <div style={{
            display: 'flex',         // Flex container to align columns
            justifyContent: 'flex-start',  // Align columns to the left
            marginTop: '20px',
            position: 'relative',    // Necessary to position the delete button
          }}>
            {/* Left Column */}
            <div style={{
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start'
            }}>
              <button onClick={handleLogout} style={buttonStyle}>
                Logout
              </button>
              <button onClick={handleChangePass} style={buttonStyle}>
                Change Password
              </button>
            </div>

            {/* Delete Account Button */}
            <button 
              onClick={handleDeleteAccount} 
              style={{
                ...buttonStyle,
                position: 'absolute',         // Position it absolutely
                right: '0',                   // Align it to the right edge
                top: '50%',                   // Center vertically between the two rows
                transform: 'translateY(-50%)', // Adjust for perfect centering
                backgroundColor: 'red',
                
              }}
            >
              Delete Account
            </button>

            {/* Right Column */}
            <div style={{
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              marginLeft: '5px'  // 5px gap between the columns
            }}>
              <button onClick={handleCharSelect} style={buttonStyle}>
                Character Select
              </button>
              <button onClick={handlegame} style={buttonStyle} >
                Back to Game
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ fontFamily: 'Silkscreen', color: 'white' }}>Loading user information...</p>
      )}
    </div>
  );
};


export default Profile;
