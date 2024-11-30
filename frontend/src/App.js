import React, { useEffect, useState } from 'react'; 
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from './signup/signup'; 
import Login from './login/login'; 
import UpdatePassword from './login/UpdatePassword';
import './App.css'; // Import the CSS file for styling
import DelAcc from './delete_account/delacc';
import Profile from './profile/profile';
import Game from './game/game';
import CharacterSelect from './character_select/character_select';

function App() {
  // State is still here if you decide to add functionality later
  const [fontFamily, setFontFamily] = useState('');
  const [selectedImage, setSelectedImage] = useState(
    localStorage.getItem('profileImage') || '/profileicons/profiledefault.png'
  );
  const [characterImage, setCharacterImage] = useState(null);  

  useEffect(() => {
    document.title = 'Little Guy'; // You can keep this if you want to update the title dynamically later
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <Router>
      <div className="App" style={{ fontFamily, paddingTop: '20px' }}>
        {/* Image at the top with fade-in effect */}
        <img src="https://i.ibb.co/Tt6zjVC/ascii-text-art-donefs.png" alt="Title" className="header-image" />

        {/* Header Section */}
        <header>
          <nav>
            <Link to="/signup">
              <button>Sign Up</button>
            </Link>
            <Link to="/login">
              <button>Log In</button>
            </Link>
            <Link to="/profile">
              <img src={selectedImage} alt="Profile" style={{width: '50px',
                height: '50px', cursor: 'pointer',}}/>
            </Link>
          </nav>
        </header>

        {/* Routes for Signup, Login, and Delete Account Pages */}
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/delete-account" element={<DelAcc />} />
          <Route path="/profile" element={<Profile selectedImage={selectedImage} setSelectedImage={setSelectedImage}/>}/>
          <Route path="/game" element={<Game />} />
          <Route path="/CharacterSelect" element={<CharacterSelect selectedImage={characterImage} 
            setSelectedImage={setCharacterImage} />}/>
          <Route path="update-password" element= {<UpdatePassword/>}/>
          {/* Add a fallback route for undefined routes */}
          <Route path="*" element={<h2>Welcome to our game!</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
