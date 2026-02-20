'use client';

import { useState, useEffect } from "react";

interface RotatingWordProps {
    words: string[];
    interval?: number; // Kept for API compatibility, though logic changes
    className?: string;
}

export default function RotatingWord({ words, className = "" }: RotatingWordProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState(words[0]);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const word = words[currentWordIndex];

        let typeSpeed = isDeleting ? 50 : 100; // Deleting is faster

        if (!isDeleting && displayedText === word) {
            // Finished typing, pause before deleting
            typeSpeed = 2000;
        } else if (isDeleting && displayedText === "") {
            // Finished deleting, move to next word
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
            typeSpeed = 500;
            return;
        }

        const timer = setTimeout(() => {
            if (!isDeleting && displayedText === word) {
                // Start deleting after pause
                setIsDeleting(true);
            } else if (isDeleting) {
                // Delete char
                setDisplayedText(word.substring(0, displayedText.length - 1));
            } else {
                // Type char
                setDisplayedText(word.substring(0, displayedText.length + 1));
            }
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, currentWordIndex, words]);

    return (
        <span className={`inline-flex items-center ${className}`}>
            <span>{displayedText}</span>
            <span
                className="w-[2px] h-[1.1em] bg-accent-red ml-1 animate-blink-cursor"
            />
        </span>
    );
}
