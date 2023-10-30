'use client'
import { useState, useEffect } from "react";


const ScrollUp = () => {

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 30) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className={(isVisible ? 'block ' : 'hidden ') + ` cursor-pointer flex justify-center items-center text-center
         rounded-xl w-9 h-9 bg-black bg-opacity-30
           hover:animate-pulse hover:text-secondary fixed bottom-6 left-4 z-20 transition-all hover:scale-110
          `}
            onClick={scrollToTop}>
            <div className="mb-1">
                ▲
            </div>
        </div>
    )
}

export default ScrollUp