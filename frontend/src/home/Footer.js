import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="footer-title">Bombiros Skokiros</p>
                <p className="footer-subtitle">Projekt stworzony przez: Kacper Zieliński</p>
                <div className="footer-links">
                    <a href="/info">O grze</a>
                    <a href="#contact">Kontakt</a>
                    <a href="https://github.com/KZielinskii" target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
                <p className="footer-copy">© 2025 Bombiros Skokiros. Wszelkie prawa zastrzeżone.</p>
            </div>
        </footer>
    );
}

export default Footer;
