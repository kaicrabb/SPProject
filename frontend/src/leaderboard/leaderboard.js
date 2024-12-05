import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Leaderboard() {
  const [scores, setScores] = useState(null); // Store leaderboard data
  const [currentUser, setCurrentUser] = useState(null); // Current user info
  const [error, setError] = useState(''); // For error handling
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/leaderboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setScores(data.scores || []); // Store scores, default to empty array
          setCurrentUser(data.currentUser || null); // Store current user info
        } else {
          setError('Failed to load leaderboard data.');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('An error occurred while fetching leaderboard data.');
      }
    };

    fetchLeaderboard();
  }, []);

  const renderLeaderboard = () => {
    if (!scores) return null;
  
    const top15 = scores.slice(0, 15); // Display top 15 users
  
    const leaderboardRows = top15.map((user, index) => {
      const placement = index + 1;
      const isCurrentUser = currentUser && user.username === currentUser.username;
  
      return (
        <tr
          key={user.username}
          style={isCurrentUser ? { color: 'gold', fontSize: 25 } : {}}
        >
          <td>{placement}</td>
          <td>{user.username}</td>
          <td>{user.score}</td>
        </tr>
      );
    });
  
    // Add the current user if not in top 15
    if (currentUser && !top15.some((user) => user.username === currentUser.username)) {
      const currentUserPlacement = scores.findIndex(
        (user) => user.username === currentUser.username
      ) + 1;
  
      leaderboardRows.push(
        <tr key="current-user" style={{ color: 'gold', fontSize: 25 }}>
          <td>{currentUserPlacement}</td>
          <td>{currentUser.username}</td>
          <td>{currentUser.score}</td>
        </tr>
      );
    }
  
    return leaderboardRows;
  };
  
  const handlegame = () => {
    navigate('/game')
  }

  return (
    <div style={{ fontFamily: 'Silkscreen', textAlign: 'center', color: 'white', paddingBottom: '15px' }}>
      <h2>Leaderboard</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : scores === null ? (
        <p>Loading leaderboard...</p>
      ) : (
        <table style={{ margin: '0 auto', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{ borderBottom: '2px solid white' }}>
              <th style={{ padding: '10px' }}>Placement</th>
              <th style={{ padding: '10px' }}>Username</th>
              <th style={{ padding: '10px' }}>Score</th>
            </tr>
          </thead>
          <tbody>{renderLeaderboard()}</tbody>
        </table>
      )}
      <button onClick={handlegame} style={{ marginTop: '10px' }}>
                Back to Game
              </button>
    </div>
  );
}

export default Leaderboard;
