import {useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';


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

    const location = useLocation();
    const players = location.state?.players || [];
    const playerName = players[0]?.name || 'Gracz';

    const bombs = useRef([]);
    const [gameTime, setGameTime] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const gameTimeRef = useRef(0);
    const bombInterval = useRef(null);
    const timeInterval = useRef(null);
    const bombWaveCount = useRef(1);



    const player = useRef({
        x: 2 * TILE_SIZE,
        y: 0,
        width: 32,
        height: 64,
        velocityX: 0,
        velocityY: 0,
        grounded: false,
        animationFrame: 0,
        animationTimer: 0,
        direction: 'idle'
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
        const backgroundImage = new Image();

        //animacja gracza
        const idleImage = new Image();
        const leftFrames = [new Image(), new Image()];
        const rightFrames = [new Image(), new Image()];

        let imagesLoaded = 0;
        const onImageLoad = () => {
            imagesLoaded++;
            if (imagesLoaded === 5) {
                requestAnimationFrame(update);
            }
        };

        //Czy gracz nie wychodzi za mape
        const isColliding = (a, b) => {
            return (
                a.x < b.x + b.size &&
                a.x + a.width > b.x &&
                a.y < b.y + b.size &&
                a.y + a.height > b.y
            );
        };

        // Czas gry
        timeInterval.current = setInterval(() => {
            gameTimeRef.current += 1;
            setGameTime(gameTimeRef.current);
        }, 1000);


        // Fale bomb
        bombInterval.current = setInterval(() => {
            for (let i = 0; i < bombWaveCount.current; i++) {
                bombs.current.push({
                    x: Math.random() * (COLS * TILE_SIZE - 20),
                    y: -800,
                    size: 20,
                    speed: 2 + Math.random() * 3
                });
            }
            bombWaveCount.current += 1;
        }, 5000);


        tileImage.onload = onImageLoad;
        backgroundImage.onload = onImageLoad;

        idleImage.onload = onImageLoad;
        leftFrames.forEach(img => img.onload = onImageLoad);
        rightFrames.forEach(img => img.onload = onImageLoad);


        tileImage.src = '/frontend/src/home/image/tile.png';
        backgroundImage.src = '/frontend/src/home/image/background.png';

        idleImage.src = '/frontend/src/home/image/player.png';
        leftFrames[0].src = '/frontend/src/home/image/l1_player.png';
        leftFrames[1].src = '/frontend/src/home/image/l2_player.png';
        rightFrames[0].src = '/frontend/src/home/image/r1_player.png';
        rightFrames[1].src = '/frontend/src/home/image/r2_player.png';


        const update = () => {

            if (gameOver) return;
            const p = player.current;
            p.velocityX = 0;


            p.direction = 'idle';
            if (keys.current.left) {
                p.velocityX = -MOVE_SPEED;
                p.direction = 'left';
            }
            if (keys.current.right) {
                p.velocityX = MOVE_SPEED;
                p.direction = 'right';
            }

            p.velocityY += GRAVITY;

            if (keys.current.up && p.grounded) {
                p.velocityY = JUMP_STRENGTH;
                p.grounded = false;
            }

            let nextX = p.x + p.velocityX;
            if (
                nextX >= 0 &&
                nextX + p.width <= COLS * TILE_SIZE &&
                !checkCollision(nextX, p.y, p.width, p.height)
            ) {
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
                } else if (p.y + p.height + p.velocityY <= ROWS * TILE_SIZE) {
                    p.y += p.velocityY;
                    p.grounded = false;
                } else {
                    p.velocityY = 0;
                    p.grounded = false;
                }
            } else {
                const nextTopY = p.y + p.velocityY;
                if (
                    nextTopY >= 0 &&
                    !checkCollision(p.x, nextTopY, p.width, p.height)
                ) {
                    p.y = nextTopY;
                    p.grounded = false;
                } else {
                    p.velocityY = 0;
                }
            }

            p.animationTimer++;
            if (p.direction !== 'idle' && p.animationTimer > 10) {
                p.animationFrame = (p.animationFrame + 1) % 2;
                p.animationTimer = 0;
            }
            if (p.direction === 'idle') {
                p.animationFrame = 0;
            }

            // Ruch bomb
            bombs.current.forEach(bomb => {
                bomb.y += bomb.speed;
            });

            // Jeśli bomba dotknie bloku o wartości 1 - wybucha (np. znika lub koniec gry)
            bombs.current = bombs.current.filter(bomb => {
                const bottomY = bomb.y + bomb.size;
                const tileBelow = getTile(bomb.x + bomb.size / 2, bottomY);

                if (tileBelow === 1) {
                    //todo animacja wybuchu
                    return false;
                }

                return true;
            });


            // Sprawdź kolizję z graczem
            for (const bomb of bombs.current) {
                if (isColliding(player.current, bomb)) {
                    setGameOver(true);
                    return;
                }
            }



            // Rysowanie
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            let imageToDraw = idleImage;
            if (p.direction === 'left') {
                imageToDraw = leftFrames[p.animationFrame];
            } else if (p.direction === 'right') {
                imageToDraw = rightFrames[p.animationFrame];
            }
            ctx.drawImage(imageToDraw, p.x, p.y, p.width, p.height);

            for (let row = 0; row < map.length; row++) {
                for (let col = 0; col < map[row].length; col++) {
                    if (map[row][col] === 1) {
                        ctx.drawImage(tileImage, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                }
            }

            // Rysowanie imienia gracza
            ctx.font = '16px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText(playerName, p.x + p.width / 2, p.y - 10);

            // Licznik czasu
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.fillText(`Czas: ${gameTimeRef.current}s`, 60, 30);

            // Rysuj bomby
            bombs.current.forEach(bomb => {
                ctx.beginPath();
                ctx.fillStyle = 'black';
                ctx.globalAlpha = 0.8;
                ctx.arc(bomb.x + bomb.size / 2, bomb.y + bomb.size / 2, bomb.size / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            });

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
            clearInterval(timeInterval.current);
            clearInterval(bombInterval.current);
        };

    }, []);


    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Gra 2D</h2>
            <canvas ref={canvasRef} width={ROWS*TILE_SIZE} height={COLS*TILE_SIZE} style={{ border: '2px solid black' }} />
            {gameOver && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '40px',
                    borderRadius: '16px',
                    fontSize: '24px',
                    zIndex: 10
                }}>
                    Koniec gry
                </div>
            )}

        </div>
    );
}

export default GamePage;
