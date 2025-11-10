// src/components/GameComponent.jsx
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../phaser/MainScene';

// 1. We still receive the emitter as a prop
const GameComponent = ({ emitter }) => {
    const gameContainerRef = useRef(null);
    const gameRef = useRef(null);

    useEffect(() => {
        if (gameRef.current) {
            return;
        }

        const config = {
            type: Phaser.AUTO,
            width: 480,
            height: 480,
            backgroundColor: '#bbada0',
            parent: gameContainerRef.current,
            scene: [MainScene] // Just list the scene
        };

        // Create the game
        gameRef.current = new Phaser.Game(config);

        // 2. (THE FIX) After creating the game,
        // safely set the emitter in the game's global registry.
        gameRef.current.registry.set('emitter', emitter);

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [emitter]); // We add emitter here

    return (
        <div id="game-container" ref={gameContainerRef}>
            {/* The game canvas will be injected here by Phaser */}
        </div>
    );
};

export default GameComponent;