import { useEffect, useRef } from 'react';
import './GamePage.css';


const map = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const TILE_SIZE = 40;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -10;
const MOVE_SPEED = 2;
const ROWS = 16;
const COLS = 16;

function GamePage() {
    const canvasRef = useRef(null);

    const player = useRef({
        x: 2 * TILE_SIZE,
        y: 0,
        width: 32,
        height: 64,
        velocityX: 0,
        velocityY: 0,
        grounded: false
    });

    const keys = useRef({
        left: false,
        right: false,
        up: false
    });

    const getTile = (x, y) => {
        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);
        if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return 0;
        return map[row][col];
    };

    const checkCollision = (px, py, pw, ph) => {
        const top = Math.floor(py / TILE_SIZE);
        const bottom = Math.floor((py + ph) / TILE_SIZE);
        const left = Math.floor(px / TILE_SIZE);
        const right = Math.floor((px + pw) / TILE_SIZE);

        for (let y = top; y < bottom; y++) {
            for (let x = left; x <= right; x++) {
                if (map[y] && map[y][x] === 1) {
                    return true;
                }
            }
        }
        return false;
    };


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const tileImage = new Image();
        const playerImage = new Image();
        const backgroundImage = new Image();

        let imagesLoaded = 0;
        const onImageLoad = () => {
            imagesLoaded++;
            if (imagesLoaded === 3) {
                requestAnimationFrame(update);
            }
        };

        tileImage.onload = onImageLoad;
        playerImage.onload = onImageLoad;
        backgroundImage.onload = onImageLoad;

        tileImage.src = '/frontend/src/home/image/tile.png';
        playerImage.src = '/frontend/src/home/image/player.png';
        backgroundImage.src = '/frontend/src/home/image/background.png';

        const update = () => {
            const p = player.current;

            p.velocityX = 0;
            if (keys.current.left) p.velocityX = -MOVE_SPEED;
            if (keys.current.right) p.velocityX = MOVE_SPEED;

            p.velocityY += GRAVITY;

            if (keys.current.up && p.grounded) {
                p.velocityY = JUMP_STRENGTH;
                p.grounded = false;
            }

            let nextX = p.x + p.velocityX;
            if (!checkCollision(nextX, p.y, p.width, p.height)) {
                p.x = nextX;
            }

            if (p.velocityY > 0) {
                const nextBottomY = p.y + p.height + p.velocityY;
                const leftFoot = getTile(p.x + 1, nextBottomY);
                const rightFoot = getTile(p.x + p.width - 1, nextBottomY);

                if (leftFoot === 1 || rightFoot === 1) {
                    p.y = Math.floor(nextBottomY / TILE_SIZE) * TILE_SIZE - p.height;
                    p.velocityY = 0;
                    p.grounded = true;
                } else {
                    p.y += p.velocityY;
                    p.grounded = false;
                }
            } else {
                const nextTopY = p.y + p.velocityY;
                if (!checkCollision(p.x, nextTopY, p.width, p.height)) {
                    p.y = nextTopY;
                    p.grounded = false;
                } else {
                    p.velocityY = 0;
                }
            }

            // Rysowanie
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            for (let row = 0; row < map.length; row++) {
                for (let col = 0; col < map[row].length; col++) {
                    if (map[row][col] === 1) {
                        ctx.drawImage(tileImage, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                }
            }

            ctx.drawImage(playerImage, p.x, p.y, p.width, p.height);

            requestAnimationFrame(update);
        };

        const handleKeyDown = (e) => {
            if (e.key === 'a') keys.current.left = true;
            if (e.key === 'd') keys.current.right = true;
            if (e.key === ' ' || e.key === 'w') keys.current.up = true;
        };

        const handleKeyUp = (e) => {
            if (e.key === 'a') keys.current.left = false;
            if (e.key === 'd') keys.current.right = false;
            if (e.key === ' ' || e.key === 'w') keys.current.up = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);


    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Gra 2D</h2>
            <canvas ref={canvasRef} width={ROWS*TILE_SIZE} height={COLS*TILE_SIZE} style={{ border: '2px solid black' }} />
        </div>
    );
}

export default GamePage;
