import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CharacterSelect({ setSelectedImage }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // Set up navigation

  // List of character images
  const CharacterImages = [
    { name: 'Tiny', src: '/charactericons/tiny.png' },
    { name: 'Cyborg', src: '/charactericons/cyborg.png' },
    { name: 'Hedgehog', src: '/charactericons/hedgehog.png'},
    { name: 'Giant', src: '/charactericons/giant.png'},
    // Add more character sprites here, place the images in the public charactericons folder,
    // name image files in all lowercase "name.png" and "name-dead.png" where name is whatever you want it to be
  ];

  // Set up design elements
  useEffect(() => {
    // Dynamically load font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Silkscreen&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Handle character selection
  const handleSelect = (character) => {
    setSelectedCharacter(character);  // Store the selected character
    setSelectedImage(character.src);  // Update the image
  };

  // Send character data to the server
  const sendCharacterToServer = async () => {
    // Check that a character was selected
    if (!selectedCharacter) {
      alert('Please select a character first.');
      return;
    }
    // Make a path to the deadsprite by taking taking name of the chosen sprite
    const deadSprite = `/charactericons/${selectedCharacter.name.toLowerCase()}-dead.png`;

    try { // try to send the paths back to the database
      // Fetch backend connection
      const response = await fetch('http://localhost:3000/submit-character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },// set both paths to be strings and send them
        body: JSON.stringify({
          character: selectedCharacter.src,
          deadSprite,
        }),
      });

      if (response.ok) { // Make sure the character images were saved
        const data = await response.json();
        console.log('Character saved successfully:', data.message);
        navigate('/game'); // Bring the player to the game
      } else {// Notify the user that the character wasn't saved
        throw new Error('Failed to save character.');
      }
    } catch (error) {// Check for any other error that caused them not ot be saved
      console.error('Error saving character:', error);
    }
  };

  return (// Set up some html for the page
    <div style={{ fontFamily: 'Silkscreen, sans-serif', textAlign: 'center', color:'white' }}>
      <h1>Select Your Character</h1>
      <p style={{fontSize: '14px', color: 'white' }}>Note: all hitboxes are the same regardless of sprite size</p>
      {selectedCharacter && (
        <h2 style={{ marginBottom: '20px', color: 'gold' }}>{selectedCharacter.name}</h2>
      )} 
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {CharacterImages.map((character, index) => (
          <div
            key={index}
            onClick={() => handleSelect(character)}
            style={{
              border: selectedCharacter?.name === character.name ? '5px solid gold' : '2px solid gray',
              boxShadow: selectedCharacter?.name === character.name ? '0 0 10px 2px gold' : 'none',
              borderRadius: '10px',
              padding: '5px',
              cursor: 'pointer',
              transition: 'border 0.3s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '140px',
              height: '150px',
            }}
          >
            <img
              src={character.src}
              alt={character.name}
              style={{
                width: '70%',
                height: '70%',
                objectFit: 'contain',
                top: '5px',
              }}
            />
            <p style={{ marginTop: '10px', fontSize: '14px', color: 'white' }}>
              {character.name}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={sendCharacterToServer}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Confirm Selection
      </button>
    </div>
  );
}

export default CharacterSelect;
