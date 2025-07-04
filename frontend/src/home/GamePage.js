import {useEffect, useRef, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";


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
    const navigate = useNavigate();
    const players = location.state?.players || [];
    const playerName = players[0]?.name || 'Gracz';
    const colors = location.state?.colors || [];
    const playerColor = colors[0] || 'green';

    const bombs = useRef([]);
    const [gameTime, setGameTime] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const gameTimeRef = useRef(0);
    const bombInterval = useRef(null);
    const timeInterval = useRef(null);
    const bombWaveCount = useRef(1);
    const arrows = useRef([]);
    const arrowInterval = useRef(null);


    const handleSaveScore = async () => {
        try {
            await axios.post("/api/scores", {
                score: gameTime,
                username: playerName
            });
            alert(`Zapisano graczowi: ${playerName} - ${gameTime} punktów!`);
            await navigate('/score');

        } catch (err) {
            console.error("Błąd przy dodawaniu wyniku:", err);
            alert("Nie udało się dodać wyniku");
        }
    };

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
        const arrowImage = new Image();
        const bombImage = new Image();

        //animacja gracza
        const idleImage = new Image();
        const leftFrames = [new Image(), new Image()];
        const rightFrames = [new Image(), new Image()];

        let imagesLoaded = 0;
        const onImageLoad = () => {
            imagesLoaded++;
            if (imagesLoaded === 7) {
                requestAnimationFrame(update);
            }
        };

        //Czy gracz nie wychodzi za mape
        const isColliding = (a, b) => {
            const bWidth = b.width || b.size;
            const bHeight = b.height || b.size;

            return (
                a.x < b.x + bWidth &&
                a.x + a.width > b.x &&
                a.y < b.y + bHeight &&
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

        //Fale strzał
        arrowInterval.current = setInterval(() => {
            arrows.current.push({
                x: COLS * TILE_SIZE,
                y: (ROWS - 2) * TILE_SIZE,
                width: 32,
                height: 32,
                speed: 4
            });
        }, 5000);



        tileImage.onload = onImageLoad;
        backgroundImage.onload = onImageLoad;

        idleImage.onload = onImageLoad;
        leftFrames.forEach(img => img.onload = onImageLoad);
        rightFrames.forEach(img => img.onload = onImageLoad);


        tileImage.src = '/frontend/src/home/image/tile.png';
        backgroundImage.src = '/frontend/src/home/image/background.png';

        idleImage.src = `/frontend/src/home/image/${playerColor}/player.png`;
        leftFrames[0].src = `/frontend/src/home/image/${playerColor}/l1_player.png`;
        leftFrames[1].src = `/frontend/src/home/image/${playerColor}/l2_player.png`;
        rightFrames[0].src = `/frontend/src/home/image/${playerColor}/r1_player.png`;
        rightFrames[1].src = `/frontend/src/home/image/${playerColor}/r2_player.png`;

        bombImage.src = '/frontend/src/home/image/bomb.png';
        bombImage.onload = onImageLoad;

        arrowImage.src = '/frontend/src/home/image/arrow.png';
        arrowImage.onload = onImageLoad;


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
                    clearInterval(timeInterval.current);
                    clearInterval(bombInterval.current);
                    return;
                }
            }

            // Ruch strzał
            arrows.current.forEach(arrow => {
                arrow.x -= arrow.speed;
            });

            // Usuwanie strzał, które wyszły poza ekran
            arrows.current = arrows.current.filter(arrow => arrow.x + arrow.width > 0);

            // Sprawdź kolizję strzały z graczem
            for (const arrow of arrows.current) {
                if (isColliding(player.current, arrow)) {
                    setGameOver(true);
                    clearInterval(timeInterval.current);
                    clearInterval(bombInterval.current);
                    clearInterval(arrowInterval.current);
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
                ctx.drawImage(bombImage, bomb.x, bomb.y, bomb.size, bomb.size);
            });

            // Rysuj strzały
            arrows.current.forEach(arrow => {
                ctx.drawImage(arrowImage, arrow.x, arrow.y, arrow.width, arrow.height);
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
            clearInterval(arrowInterval.current);
        };

    }, []);


    return (
        <div style={{ textAlign: 'center' }}>
            <canvas
                ref={canvasRef}
                width={ROWS * TILE_SIZE}
                height={COLS * TILE_SIZE}
                style={{ border: '2px solid black' }}
            />
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
                    <p>Koniec gry</p>
                    <p>Twój wynik: {gameTime} sekund</p>
                    <button onClick={handleSaveScore} style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                        Zapisz wynik
                    </button>
                </div>
            )}
        </div>
    );

}

export default GamePage;
