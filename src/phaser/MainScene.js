import Phaser from 'phaser';

// --- Game Settings ---
const TILE_SIZE = 100;
const TILE_SPACING = 15;

export class MainScene extends Phaser.Scene {

    constructor() {
        // 'MainScene' is the key for this scene
        super('MainScene');

        // Initialize our "brain" properties
        this.board = [];
        this.tileSprites = [];
        this.tileText = [];
    }

    preload() {
        // Nothing to load yet
    }

    create() {
        // Initialize our "brain" arrays
        this.board = [];
        this.tileSprites = [];
        this.tileText = [];

        var graphics = this.add.graphics();

        // Loop 4 times for rows (y-axis)
        for (var y = 0; y < 4; y++) {
            // Add a new empty row to our "brain" arrays
            this.board[y] = [];
            this.tileSprites[y] = [];
            this.tileText[y] = [];

            // Loop 4 times for columns (x-axis)
            for (var x = 0; x < 4; x++) {
                // --- Create the visual tile ---
                var xPos = TILE_SPACING + (x * (TILE_SIZE + TILE_SPACING));
                var yPos = TILE_SPACING + (y * (TILE_SIZE + TILE_SPACING));
                graphics.fillStyle(0xcdc1b4, 1);
                graphics.fillRoundedRect(xPos, yPos, TILE_SIZE, TILE_SIZE, 10);

                // --- Initialize the "brain" for this spot ---
                this.board[y][x] = 0; // 0 means empty
                this.tileSprites[y][x] = null;
                this.tileText[y][x] = null;
            }
        }

        // --- Let's start the game! ---
        this.spawnNumber();
        this.spawnNumber();

        console.log("Board initialized:", this.board);
    }

    // This is now a method of the MainScene class
    spawnNumber() {
        var emptySpots = [];
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                if (this.board[y][x] === 0) {
                    emptySpots.push({ y: y, x: x });
                }
            }
        }

        if (emptySpots.length === 0) {
            console.log("No empty spots left!");
            return;
        }

        var randomSpot = Phaser.Utils.Array.GetRandom(emptySpots);
        var y = randomSpot.y;
        var x = randomSpot.x;

        this.board[y][x] = 2;

        // --- Create the visual tile ---
        var xPos = TILE_SPACING + (x * (TILE_SIZE + TILE_SPACING));
        var yPos = TILE_SPACING + (y * (TILE_SIZE + TILE_SPACING));

        var tile = this.add.graphics(); // 'this' now refers to the Scene
        tile.fillStyle(0xeee4da, 1);
        tile.fillRoundedRect(xPos, yPos, TILE_SIZE, TILE_SIZE, 10);
        this.tileSprites[y][x] = tile;

        // --- Create the number text ---
        var text = this.add.text(
            xPos + (TILE_SIZE / 2),
            yPos + (TILE_SIZE / 2),
            "2",
            {
                fontFamily: 'Arial',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#776e65'
            }
        );
        text.setOrigin(0.5, 0.5);
        this.tileText[y][x] = text;
    }
}