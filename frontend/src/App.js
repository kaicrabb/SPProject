import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from './signup/signup'; // Assuming you have a SignUp component
import Login from './login/login'; // Assuming you have a Login component
import './App.css'; // Import the CSS file for styling

function App() {
  // State to hold font family and gradient background
  const [fontFamily, setFontFamily] = useState('');
  const [gradient, setGradient] = useState('');

  useEffect(() => {
    document.title = 'Little Guy';

    // Array of font families
    const fonts = [
      'Courier New', 
      'Lucida Console', 
      'Monaco', 
      'Consolas', 
      'Menlo'
    ];

    // Array of gradient color combinations
    const gradients = [
      'linear-gradient(to right, limegreen, pink)',
      'linear-gradient(to right, indigo, limegreen)',
      'linear-gradient(to right, orange, limegreen)',
      'linear-gradient(to right, maroon, limegreen)',
      'linear-gradient(to right, purple, limegreen)',
    ];

    // Randomly select a font and gradient
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    setFontFamily(randomFont);
    setGradient(randomGradient);
  }, []);

  return (
    <Router>
      <div className="App" style={{ fontFamily, background: gradient, paddingTop: '20px' }}>
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
          </nav>
        </header>

        {/* Routes for Signup and Login Pages */}
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Add a fallback route for undefined routes */}
          <Route path="*" element={<h2>Welcome to our game!</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
