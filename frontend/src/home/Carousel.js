import { useRef, useEffect, useState } from 'react';
import './Carousel.css';

const Carousel = () => {
    const carouselRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;

    const goToSlide = (index) => {
        if (carouselRef.current) {
            carouselRef.current.style.transform = `translateX(-${index * 100}%)`;
        }
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % totalSlides);
    };

    const prevSlide = () => {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [currentSlide]);

    return (
        <div className="carousel-container">
            <ul className="carousel" ref={carouselRef}>
                <li className="slide"><img src="/frontend/src/home/image/image1.png" alt="Opis obrazu 1" /></li>
                <li className="slide"><img src="/frontend/src/home/image/image2.png" alt="Opis obrazu 2" /></li>
                <li className="slide"><img src="/frontend/src/home/image/image3.png" alt="Opis obrazu 3" /></li>
            </ul>
            <button className="prev" onClick={prevSlide}>Poprzedni</button>
            <button className="next" onClick={nextSlide}>Następny</button>
        </div>
    );
};

export default Carousel;
