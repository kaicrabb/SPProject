import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import SignUp from './signup/signup'; // Import Signup function from signup
import Login from './login/login'; // Import Login function from login
import UpdatePassword from './login/UpdatePassword';
import './App.css'; // Import the CSS file for styling
import DelAcc from './delete_account/delacc'; // Import DelAcc function from delacc
import Profile from './profile/profile'; // Import Profile function from profile
import Game from './game/game'; // Import Game function from game
import CharacterSelect from './character_select/character_select'; // Import CharacterSelect function from character_select
import Leaderboard from './leaderboard/leaderboard'; // Import Leaderboard function from leaderboard

function App() {
  // Set up constants to use in the app
  const [fontFamily] = useState('');
  const [selectedImage, setSelectedImage] = useState(localStorage.getItem('profileImage') || '/profileicons/profiledefault.png');
  const [characterImage, setCharacterImage] = useState(null);

  // Check if the user is logged in, used to block out the user from certain pages if not logged in
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;  
  }

  useEffect(() => { // Display our title
    document.title = 'Little Guy';
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <Router>
      <div className="App" style={{ fontFamily, paddingTop: '20px' }}>
        {/* Image at the top with fade-in effect */}
        <img src="https://i.ibb.co/Tt6zjVC/ascii-text-art-donefs.png" alt="Title" className="header-image" />

        {/* Buttons to go to certain pages */}
        <header>
          <nav>
            <Link to="/signup">
              <button>Sign Up</button>
            </Link>
            <Link to="/login">
              <button>Log In</button>
            </Link>
            <Link to="/leaderboard">
              <button>Leaderboards</button>
            </Link>
            <Link to="/profile"> 
              {/* Set profile button to be your profile icon */}
              <img src={selectedImage} alt="Profile" style={{ width: '50px', height: '50px', cursor: 'pointer' }} />
            </Link>
          </nav>
        </header>

        {/* Routes for Signup, Login, and Delete Account Pages */}
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/delete-account" element={isAuthenticated() ? <DelAcc /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuthenticated() ? <Profile selectedImage={selectedImage} setSelectedImage={setSelectedImage} /> : <Navigate to="/login" replace />} />
          <Route path="/game" element={isAuthenticated() ? <Game /> : <Navigate to="/login" replace />} />
          <Route path="/leaderboard" element={isAuthenticated() ? <Leaderboard /> : <Navigate to="/login" replace />} />
          <Route path="/CharacterSelect" element={isAuthenticated() ? <CharacterSelect selectedImage={characterImage} setSelectedImage={setCharacterImage} /> : <Navigate to="/login" replace />} />
          <Route path="/update-password" element={isAuthenticated() ? <UpdatePassword /> : <Navigate to="/login" replace />} />

          {/* Add a fallback route for undefined routes */}
          <Route path="*" element={<h2>Welcome to our game!</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
