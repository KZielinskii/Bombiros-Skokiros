function Game({ player }) {
    if (!player) return <p>Nie wybrano postaci. Wróć do formularza.</p>;

    return (
        <div>
            <h2>Gra w labiryncie</h2>
            <p>Gracz: {player.name} jako {player.character}</p>
            {/* Komponent gry labiryntowej */}
        </div>
    );
}

export default Game;
