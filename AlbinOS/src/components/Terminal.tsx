import React, { useEffect, useRef, useState } from 'react';
import { useTerminal } from '../hooks/useTerminal';
import { registerAllCommands } from '../utils/registerCommands';
import { config } from '../config';

const Terminal: React.FC = () => {
    const { history, currentPath, executeCommand, username, hostname, inputHandler } = useTerminal();
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Check if in SSH session
    const isSSH = username !== config.username || hostname !== config.hostname;
    const isItemSSH = (itemUsername: string, itemHostname: string) =>
        itemUsername !== config.username || itemHostname !== config.hostname;

    // Initial command registration
    useEffect(() => {
        registerAllCommands();
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Focus input on click anywhere
    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            executeCommand(input);
            setInput('');
        }
    };

    return (
        <div
            className="w-full h-full min-h-full p-4 overflow-y-auto font-mono text-sm md:text-base leading-relaxed"
            onClick={handleContainerClick}
        >
            {/* History */}
            {history.map((item, index) => (
                <div key={index} className="mb-2">
                    {!item.hidePrompt && (
                        <div className="flex flex-row items-center">
                            <span className={`font-bold mr-2 ${isItemSSH(item.username, item.hostname) ? 'text-green-300' : 'text-terminal-text'}`}>{item.username}@{item.hostname}:</span>
                            <span className="text-blue-400 font-bold mr-2">~/{item.path.slice(2).join('/')}</span>
                            <span className="text-terminal-dim mr-2">$</span>
                            <span>{item.command}</span>
                        </div>
                    )}
                    {item.output.content && (
                        <div className="ml-0 mt-1 whitespace-pre-wrap text-zinc-300">
                            {item.output.content}
                        </div>
                    )}
                </div>
            ))}

            {/* Current Input Line */}
            <div className="flex flex-row items-center">
                {!inputHandler && (
                    <div className="flex flex-row items-center mr-2">
                        <span className={`font-bold mr-2 ${isSSH ? 'text-green-300' : 'text-terminal-text'}`}>{username}@{hostname}:</span>
                        <span className="text-blue-400 font-bold">~/{currentPath.slice(2).join('/')}</span>
                        <span className="text-terminal-dim ml-2">$</span>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none outline-none flex-grow text-inherit caret-current"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default Terminal;
