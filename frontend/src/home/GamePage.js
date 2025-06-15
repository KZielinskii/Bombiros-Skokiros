import { useEffect, useRef } from 'react';
import './GamePage.css';


const map = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
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
        width: 30,
        height: 30,
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

        for (let y = top; y <= bottom; y++) {
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

        const update = () => {
            const p = player.current;

            // Ruch poziomy
            p.velocityX = 0;
            if (keys.current.left) p.velocityX = -MOVE_SPEED;
            if (keys.current.right) p.velocityX = MOVE_SPEED;

            // Grawitacja
            p.velocityY += GRAVITY;

            // Skok
            if (keys.current.up && p.grounded) {
                p.velocityY = JUMP_STRENGTH;
                p.grounded = false;
            }

            // Przesunięcia
            let nextX = p.x + p.velocityX;
            let nextY = p.y + p.velocityY;

            // Kolizje poziome
            if (!checkCollision(nextX, p.y, p.width, p.height)) {
                p.x = nextX;
            }

            // Kolizje pionowe
            if (p.velocityY > 0) {
                // Ruch w dół – sprawdź, czy grunt pod spodem
                const nextBottomY = p.y + p.height + p.velocityY;
                const tileBelow = getTile(p.x + p.width / 2, nextBottomY);
                if (tileBelow === 1) {
                    // zatrzymaj na kafelku
                    p.y = Math.floor((p.y + p.height + p.velocityY) / TILE_SIZE) * TILE_SIZE - p.height;
                    p.velocityY = 0;
                    p.grounded = true;
                } else {
                    p.y += p.velocityY;
                    p.grounded = false;
                }
            } else {
                // Ruch w górę lub brak ruchu – normalne sprawdzanie kolizji
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

            // Mapa
            for (let row = 0; row < map.length; row++) {
                for (let col = 0; col < map[row].length; col++) {
                    if (map[row][col] === 1) {
                        ctx.fillStyle = 'saddlebrown';
                        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                }
            }

            // Gracz
            ctx.fillStyle = 'red';
            ctx.fillRect(p.x, p.y, p.width, p.height);

            requestAnimationFrame(update);
        };

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') keys.current.left = true;
            if (e.key === 'ArrowRight') keys.current.right = true;
            if (e.key === ' ' || e.key === 'ArrowUp') keys.current.up = true;
        };

        const handleKeyUp = (e) => {
            if (e.key === 'ArrowLeft') keys.current.left = false;
            if (e.key === 'ArrowRight') keys.current.right = false;
            if (e.key === ' ' || e.key === 'ArrowUp') keys.current.up = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        update();

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Platformówka 2D</h2>
            <canvas ref={canvasRef} width={ROWS*TILE_SIZE} height={COLS*TILE_SIZE} style={{ border: '2px solid black' }} />
        </div>
    );
}

export default GamePage;
