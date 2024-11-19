export async function getCharacterImages(token) {
    const defaultCyborgImgSrc = `${process.env.PUBLIC_URL || ''}/img/cyborg.png`;
    const defaultCyborgDeadImgSrc = `${process.env.PUBLIC_URL || ''}/img/cyborg-dead.png`;
  
    try {
      const response = await fetch('http://localhost:3000/get-character', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const cyborgImgSrc = data.selectedCharacter || defaultCyborgImgSrc;
        const cyborgDeadImgSrc = data.deadSprite || defaultCyborgDeadImgSrc;
        return { cyborgImgSrc, cyborgDeadImgSrc };
      } else {
        console.error('Failed to fetch character data');
        return { cyborgImgSrc: defaultCyborgImgSrc, cyborgDeadImgSrc: defaultCyborgDeadImgSrc };
      }
    } catch (error) {
      console.error('Error fetching character data:', error);
      return { cyborgImgSrc: defaultCyborgImgSrc, cyborgDeadImgSrc: defaultCyborgDeadImgSrc };
    }
  }
  