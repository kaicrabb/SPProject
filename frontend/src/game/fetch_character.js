export async function getCharacterImages(token) {
  // Set default player images (may not work perfectly)
    const defaultCyborgImgSrc = `${process.env.PUBLIC_URL || ''}/img/cyborg.png`;
    const defaultCyborgDeadImgSrc = `${process.env.PUBLIC_URL || ''}/img/cyborg-dead.png`;
  
    // Try to get the character images
    try { // Set up backend fetch
      const response = await fetch('http://localhost:3000/get-character', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // If the response was good continue
      if (response.ok) {
        const data = await response.json(); // Wait for the response to come through
        const cyborgImgSrc = data.selectedCharacter || defaultCyborgImgSrc; // Change cyborg image to selected character image
        const cyborgDeadImgSrc = data.deadSprite || defaultCyborgDeadImgSrc; // Same as last line but with dead cyborg images
        return { cyborgImgSrc, cyborgDeadImgSrc }; // Send back the images
      } else { // Check for errors and send back defaults if so
        console.error('Failed to fetch character data');
        return { cyborgImgSrc: defaultCyborgImgSrc, cyborgDeadImgSrc: defaultCyborgDeadImgSrc };
      }
    } catch (error) { // Check for errors in the try and send back defaults
      console.error('Error fetching character data:', error);
      return { cyborgImgSrc: defaultCyborgImgSrc, cyborgDeadImgSrc: defaultCyborgDeadImgSrc };
    }
  }
  