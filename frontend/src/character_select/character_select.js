import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CharacterSelect({ setSelectedImage }) {
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // List of character images
    const CharacterImages = [
        { name: 'Tiny', src: '/charactericons/tiny.png' },
        // Add more character sprites here, make sure png name is all lowercase, and name matches png name
        // Dead sprites should be named "name"-dead.png check tiny in public/charactericons for example
    ];

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
        setSelectedCharacter(character);
        setSelectedImage(character.src);
    };

    // Send character data to the server
    const sendCharacterToServer = async () => {
        if (!selectedCharacter) {
            alert('Please select a character first.');
            return;
        }
    
        // Log the selected character and the constructed deadSprite
        console.log('Selected Character:', selectedCharacter);
        const deadSprite = `/charactericons/${selectedCharacter.name.toLowerCase()}-dead.png`;
        console.log('Dead Sprite:', deadSprite);
    
        try {
            const response = await fetch('http://localhost:3000/submit-character', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    character: selectedCharacter.src,
                    deadSprite: deadSprite, // Using the computed deadSprite value
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Character saved successfully:', data.message);
                navigate('/game'); 
            } else {
                throw new Error('Failed to save character.');
            }
        } catch (error) {
            console.error('Error saving character:', error);
        }
    };

    return (
        <div style={{ fontFamily: 'Silkscreen, sans-serif', textAlign: 'center' }}>
            <h1>Select Your Character</h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {CharacterImages.map((character, index) => (
                    <div
                        key={index}
                        onClick={() => handleSelect(character)}
                        style={{
                            border: selectedCharacter === character ? '3px solid gold' : '2px solid gray',
                            borderRadius: '10px',
                            padding: '10px',
                            cursor: 'pointer',
                            transition: 'border 0.3s',
                        }}
                    >
                        <img
                            src={character.src}
                            alt={character.name}
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <p>{character.name}</p>
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
