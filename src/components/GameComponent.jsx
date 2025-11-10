import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../phaser/MainScene';

const GameComponent = () => {
    // This 'ref' will point to the div element where our game will live
    const gameContainerRef = useRef(null);
    
    // This 'ref' will hold the Phaser game instance
    const gameRef = useRef(null);

    // This useEffect hook runs only ONCE when the component is first mounted
    useEffect(() => {
        // Do nothing if the game instance already exists
        if (gameRef.current) {
            return;
        }

        // The configuration for our Phaser game
        const config = {
            type: Phaser.AUTO,
            width: 480,
            height: 480,
            backgroundColor: '#bbada0',
            parent: gameContainerRef.current, // Attach the game to our div
            scene: [MainScene] // Tell Phaser which scene to load
        };

        // Create the new Phaser game instance
        gameRef.current = new Phaser.Game(config);

        // This is a "cleanup" function
        // It runs when the component is unmounted (e.g., changing pages)
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true); // Destroy the game
                gameRef.current = null;
            }
        };
    }, []); // The empty array [] means "run this effect only once"

    // Render a simple div. Phaser will attach its <canvas> inside this div.
    return (
        <div id="game-container" ref={gameContainerRef}>
            {/* The game will appear here */}
        </div>
    );
};

export default GameComponent;