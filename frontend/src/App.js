import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignUp from './signup/signup'; // Assuming you have a SignUp component
import Login from './login/login'; // Assuming you have a Login component

function App() {
  return (
    <Router> {/* Make sure this is here to wrap your routes */}
      <div className="App">
        <h1>Welcome to Our Application</h1>
        <p>Click below to either Sign Up or Log In:</p>

        {/* Buttons for navigation */}
        <div>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
          <Link to="/login">
            <button>Log In</button>
          </Link>
        </div>

        {/* Routes for Signup and Login Pages */}
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
