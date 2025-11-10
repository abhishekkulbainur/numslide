// src/phaser/MainScene.js
import Phaser from 'phaser';

// --- Game Settings ---
const TILE_SIZE = 100;
const TILE_SPACING = 15;
const BOARD_SIZE = 4;

// --- (THE FULL, CORRECT TILE_COLORS OBJECT) ---
const TILE_COLORS = {
    0:    [0xcdc1b4, 0x776e65, 64],
    2:    [0xeee4da, 0x776e65, 64],
    4:    [0xede0c8, 0x776e65, 64],
    8:    [0xf2b179, 0xf9f6f2, 64],
    16:   [0xf59563, 0xf9f6f2, 64],
    32:   [0xf67c5f, 0xf9f6f2, 64],
    64:   [0xf65e3b, 0xf9f6f2, 64],
    128:  [0xedcf72, 0xf9f6f2, 52],
    256:  [0xedcc61, 0xf9f6f2, 52],
    512:  [0xedc850, 0xf9f6f2, 52],
    1024: [0xedc53f, 0xf9f6f2, 40],
    2048: [0xedc22e, 0xf9f6f2, 40],
};
// ---------------------------------------------

export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        // Nothing to load
    }

    create() {
        this.emitter = this.game.registry.get('emitter');

        this.score = 0;
        this.board = [];
        this.tileSprites = [];
        this.tileText = [];
        this.canMove = true;
        this.swipeStartX = 0; // For swipe controls
        this.swipeStartY = 0; // For swipe controls

        this.createBoard();
        this.startGame();

        if (this.emitter) {
            this.emitter.on('restartGame', this.restartGame, this);
        } else {
            console.error("Emitter is not available in MainScene");
        }

        // --- Keyboard Controls ---
        this.input.keyboard.on('keydown-UP',    () => this.handleMove(0, -1));
        this.input.keyboard.on('keydown-DOWN',  () => this.handleMove(0, 1));
        this.input.keyboard.on('keydown-LEFT',  () => this.handleMove(-1, 0));
        this.input.keyboard.on('keydown-RIGHT', () => this.handleMove(1, 0));

        // --- (NEW) Mobile Swipe Controls ---
        this.input.on('pointerdown', (pointer) => {
            this.swipeStartX = pointer.x;
            this.swipeStartY = pointer.y;
        });

        this.input.on('pointerup', (pointer) => {
            if (!this.swipeStartX || !this.swipeStartY) {
                return; // Didn't start swipe on the game
            }

            let swipeEndX = pointer.x;
            let swipeEndY = pointer.y;

            let dx = swipeEndX - this.swipeStartX;
            let dy = swipeEndY - this.swipeStartY;

            // Reset swipe start
            this.swipeStartX = 0;
            this.swipeStartY = 0;

            if (!this.canMove) return; // Don't swipe if already moving

            // Check for minimum swipe distance
            const minSwipeDistance = 50;

            if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
                if (Math.abs(dx) > minSwipeDistance) {
                    if (dx > 0) {
                        this.handleMove(1, 0); // Right
                    } else {
                        this.handleMove(-1, 0); // Left
                    }
                }
            } else { // Vertical swipe
                if (Math.abs(dy) > minSwipeDistance) {
                    if (dy > 0) {
                        this.handleMove(0, 1); // Down
                    } else {
                        this.handleMove(0, -1); // Up
                    }
                }
            }
        });
        // --- End of Swipe Controls ---
    }

    createBoard() {
        var graphics = this.add.graphics();
        for (let y = 0; y < BOARD_SIZE; y++) {
            this.board[y] = [];
            this.tileSprites[y] = [];
            this.tileText[y] = [];
            for (let x = 0; x < BOARD_SIZE; x++) {
                let xPos = this.getTileX(x);
                let yPos = this.getTileY(y);
                graphics.fillStyle(TILE_COLORS[0][0], 1);
                graphics.fillRoundedRect(xPos, yPos, TILE_SIZE, TILE_SIZE, 10);
                this.board[y][x] = 0;
                this.tileSprites[y][x] = null;
                this.tileText[y][x] = null;
            }
        }
    }

    startGame() {
        this.score = 0;
        if (this.emitter) {
            this.emitter.emit('updateScore', this.score);
        }
        this.spawnNumber();
        this.spawnNumber();
    }
    
    restartGame() {
        this.canMove = false;
        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                 if (this.board[y][x] !== 0) {
                     this.tileSprites[y][x].destroy();
                     this.tileText[y][x].destroy();
                     this.board[y][x] = 0;
                     this.tileSprites[y][x] = null;
                     this.tileText[y][x] = null;
                 }
            }
        }
        this.startGame();
        this.canMove = true;
    }

    getTileX(x) {
        return TILE_SPACING + (x * (TILE_SIZE + TILE_SPACING));
    }
    getTileY(y) {
        return TILE_SPACING + (y * (TILE_SIZE + TILE_SPACING));
    }

    spawnNumber() {
        let emptySpots = [];
        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                if (this.board[y][x] === 0) {
                    emptySpots.push({ y: y, x: x });
                }
            }
        }

        if (emptySpots.length === 0) {
            // TODO: Check for Game Over
            return;
        }

        let spot = Phaser.Utils.Array.GetRandom(emptySpots);
        let value = (Math.random() < 0.9) ? 2 : 4;
        this.board[spot.y][spot.x] = value;
        this.createTile(spot.x, spot.y, value);
    }
    
    createTile(x, y, value) {
        let xPos = this.getTileX(x);
        let yPos = this.getTileY(y);
        let [color, textColor, fontSize] = TILE_COLORS[value] || TILE_COLORS[2048];
        
        let tile = this.add.graphics();
        tile.fillStyle(color, 1);
        tile.fillRoundedRect(xPos, yPos, TILE_SIZE, TILE_SIZE, 10);
        this.tileSprites[y][x] = tile;
        
        let text = this.add.text(
            xPos + (TILE_SIZE / 2),
            yPos + (TILE_SIZE / 2),
            value.toString(),
            {
                fontFamily: 'Arial',
                fontSize: `${fontSize}px`,
                fontWeight: 'bold',
                color: `#${textColor.toString(16)}`
            }
        );
        text.setOrigin(0.5, 0.5);
        this.tileText[y][x] = text;
        
        tile.scaleX = 0;
        tile.scaleY = 0;
        text.scaleX = 0;
        text.scaleY = 0;
        this.tweens.add({
            targets: [tile, text],
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Power2'
        });
    }

    handleMove(dx, dy) {
        if (!this.canMove) return;
        this.canMove = false;
        let moved = false;
        let mergeScore = 0;
        let yStart = (dy === 1) ? (BOARD_SIZE - 2) : 0;
        let yEnd = (dy === 1) ? -1 : BOARD_SIZE;
        let yStep = (dy === 1) ? -1 : 1;
        let xStart = (dx === 1) ? (BOARD_SIZE - 2) : 0;
        let xEnd = (dx === 1) ? -1 : BOARD_SIZE;
        let xStep = (dx === 1) ? -1 : 1;
        let tilesToAnimate = [];

        for (let y = yStart; y !== yEnd; y += yStep) {
            for (let x = xStart; x !== xEnd; x += xStep) {
                if (this.board[y][x] === 0) continue;
                let current = { x, y };
                let next = { x: current.x + dx, y: current.y + dy };
                while (next.x >= 0 && next.x < BOARD_SIZE && next.y >= 0 && next.y < BOARD_SIZE) {
                    if (this.board[next.y][next.x] === 0) {
                        current = next;
                        next = { x: current.x + dx, y: current.y + dy };
                    } else if (this.board[next.y][next.x] === this.board[y][x]) {
                        let value = this.board[y][x] * 2;
                        mergeScore += value;
                        this.board[next.y][next.x] = value;
                        this.board[y][x] = 0;
                        tilesToAnimate.push({ from: { x, y }, to: { x: next.x, y: next.y }, isMerge: true, newValue: value });
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
                if ((current.x !== x || current.y !== y) && (this.board[current.y][current.x] === 0)) {
                    this.board[current.y][current.x] = this.board[y][x];
                    this.board[y][x] = 0;
                    tilesToAnimate.push({ from: { x, y }, to: { x: current.x, y: current.y }, isMerge: false });
                    moved = true;
                }
            }
        }
        if (tilesToAnimate.length > 0) {
            this.animateMoves(tilesToAnimate, mergeScore);
        } else {
            this.canMove = true;
        }
    }

    animateMoves(tiles, mergeScore) {
        let tweensCompleted = 0;
        tiles.forEach(move => {
            let oldX = move.from.x, oldY = move.from.y, newX = move.to.x, newY = move.to.y;
            let tile = this.tileSprites[oldY][oldX];
            let text = this.tileText[oldY][oldX];
            
            if (!tile || !text) { // Safety check
                tweensCompleted++;
                return; 
            }
            
            this.tileSprites[newY][newX] = tile;
            this.tileText[newY][newX] = text;
            this.tileSprites[oldY][oldX] = null;
            this.tileText[oldY][oldX] = null;

            this.tweens.add({
                targets: [tile, text],
                x: this.getTileX(newX) + (tile.isFilled ? 0 : TILE_SIZE / 2),
                y: this.getTileY(newY) + (tile.isFilled ? 0 : TILE_SIZE / 2),
                duration: 100,
                ease: 'Power1',
                onComplete: () => {
                    tweensCompleted++;
                    if (move.isMerge) {
                        let [color, textColor, fontSize] = TILE_COLORS[move.newValue] || TILE_COLORS[2048];
                        this.tileSprites[newY][newX].clear().fillStyle(color).fillRoundedRect(this.getTileX(newX), this.getTileY(newY), TILE_SIZE, TILE_SIZE, 10);
                        this.tileText[newY][newX].setText(move.newValue).setColor(`#${textColor.toString(16)}`).setFontSize(`${fontSize}px`);
                        this.tweens.add({
                            targets: [this.tileSprites[newY][newX], this.tileText[newY][newX]],
                            scaleX: 1.1, scaleY: 1.1, duration: 80, yoyo: true, ease: 'Power1'
                        });
                        tile.destroy();
                        text.destroy();
                    }
                    if (tweensCompleted === tiles.length) {
                        this.score += mergeScore;
                        if (this.emitter) {
                            this.emitter.emit('updateScore', this.score);
                        }
                        this.spawnNumber();
                        this.canMove = true;
                    }
                }
            });
        });
    }
}