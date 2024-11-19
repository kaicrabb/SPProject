export const preloadImages = async (token) => {
    try {
      const characterResponse = await fetch('http://localhost:5000/get-character', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const characterImages = await characterResponse.json();
  
      const cyborgImg = new Image();
      cyborgImg.src = characterImages.cyborgImgSrc;
  
      const cyborgDeadImg = new Image();
      cyborgDeadImg.src = characterImages.cyborgDeadImgSrc;
  
      return {
        cyborgImgSrc: characterImages.cyborgImgSrc,
        cyborgDeadImgSrc: characterImages.cyborgDeadImgSrc,
      };
    } catch (error) {
      console.error('Error preloading images:', error);
      throw error;
    }
  };
  