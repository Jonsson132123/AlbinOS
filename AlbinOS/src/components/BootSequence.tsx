import React, { useState, useEffect, useRef } from 'react';

interface BootSequenceProps {
    onComplete: () => void;
}

const bootLines = [
    "Initialising AlbinOS kernel...",
    "Loading typical-portfolio-modules...",
    "Mounting virtual file systems...",
    "Starting network configuration...",
    "Applying CSS variables to global scope...",
    "Starting React reconciliation process...",
    "Loading 'whoami' user profile...",
    "Mounting /home/albin...",
    "Checking projects integrity...",
    "Starting interactive terminal session...",
    "Reached target Graphical Interface."
];

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex >= bootLines.length) {
                clearInterval(interval);
                setTimeout(onComplete, 800); // Small pause after last line before switching
                return;
            }

            setLines(prev => [...prev, bootLines[currentIndex]]);
            currentIndex++;
        }, 300); // Adjust speed here (300ms * 11 lines approx 3.3s + overhead)

        return () => clearInterval(interval);
    }, [onComplete]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    return (
        <div className="w-full h-full bg-terminal-bg text-terminal-text p-4 font-mono text-sm md:text-base overflow-y-auto">
            {lines.map((line, index) => (
                <div key={index} className="flex flex-row items-center mb-1">
                    <span className="text-green-500 font-bold mr-2">[ OK ]</span>
                    <span>{line}</span>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
};

export default BootSequence;
