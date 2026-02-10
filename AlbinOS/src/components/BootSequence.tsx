import React, { useState, useEffect, useRef } from 'react';

interface BootSequenceProps {
    onComplete: () => void;
}

const bootLines = [
    "AlbinOS 0.9.2 (tty1)",
    "Loading kernel 6.12.0-albinos ...",
    "Loading initial ramdisk ...",
    "Started Journal Service.",
    "Started udev Kernel Device Manager.",
    "Activated swap /dev/sda2.",
    "Mounted FUSE Control File System.",
    "Mounting Temporary Directory /tmp...",
    "Reached target Local File Systems.",
    "Started Network Manager.",
    "Reached target Network.",
    "Started OpenSSH Daemon.",
    "Started CUPS Scheduler.",
    "Started User Login Management.",
    "Started NSO_Spyware.",
    "Mounted /home/albin.",
    "Started Getty on tty1.",
    "Reached target Multi-User System.",
    "Reached target Graphical Interface.",
    "Starting interactive shell session..."
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
        }, 115); // Adjust speed here (300ms * 11 lines approx 3.3s + overhead)

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
