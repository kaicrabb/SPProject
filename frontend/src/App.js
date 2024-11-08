import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from './signup/signup'; // Assuming you have a SignUp component
import Login from './login/login'; // Assuming you have a Login component
import './App.css'; // Import the CSS file for styling

function App() {
  return (
    <Router>
      <div className="App">
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
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
