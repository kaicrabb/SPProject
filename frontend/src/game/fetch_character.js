export async function getCharacterImages(token) {
    // Default image paths
    const defaultCyborgImgSrc = './img/cyborg.png';
    const defaultCyborgDeadImgSrc = './img/cyborg-dead.png';

    try {
        const response = await fetch('http://localhost:3000/get-character', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();

            // Use database values if available, else fall back to defaults
            const cyborgImgSrc = data.selectedCharacter || defaultCyborgImgSrc;
            const cyborgDeadImgSrc = data.deadSprite || defaultCyborgDeadImgSrc;

            // Preload images
            const cyborgImg = new Image();
            cyborgImg.src = cyborgImgSrc;

            const cyborgDeadImg = new Image();
            cyborgDeadImg.src = cyborgDeadImgSrc;

            return {
                cyborgImgSrc,
                cyborgDeadImgSrc,
            };
        } else {
            console.error('Failed to fetch character data');
            return {
                cyborgImgSrc: defaultCyborgImgSrc,
                cyborgDeadImgSrc: defaultCyborgDeadImgSrc,
            };
        }
    } catch (error) {
        console.error('Error fetching character data:', error);
        return {
            cyborgImgSrc: defaultCyborgImgSrc,
            cyborgDeadImgSrc: defaultCyborgDeadImgSrc,
        };
    }
}
