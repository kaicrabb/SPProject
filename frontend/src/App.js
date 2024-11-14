import React, { useEffect, useState } from 'react'; 
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from './signup/signup'; // Assuming you have a SignUp component
import Login from './login/login'; // Assuming you have a Login component
import './App.css'; // Import the CSS file for styling
import DelAcc from './delete_account/delacc';

function App() {
  // State is still here if you decide to add functionality later
  const [fontFamily, setFontFamily] = useState('');

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
          <h1>Little Guy</h1>
          <nav>
            <Link to="/signup">
              <button>Sign Up</button>
            </Link>
            <Link to="/login">
              <button>Log In</button>
            </Link>
            <Link to="/delacc">
              <button>Delete Account</button>
            </Link>
          </nav>
        </header>

        {/* Routes for Signup, Login, and Delete Account Pages */}
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/delacc" element={<DelAcc />} />
          {/* Add a fallback route for undefined routes */}
          <Route path="*" element={<h2>Welcome to our game!</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
