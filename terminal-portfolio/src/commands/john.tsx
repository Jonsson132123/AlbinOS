import React, { useState, useEffect } from 'react';
import type { Command, TerminalContextType } from '../types/Command';
import { navigateToNode, resolvePath } from '../utils/fileSystemUtils';

// Hardcoded hash -> password mappings for the CTF
const knownHashes: { [hash: string]: string } = {
    '8ebe0716326076a5bfc67b58b97087fa': 'brunstigälg99',
    // Add more mappings here as needed
};

interface CrackingAnimationProps {
    hashes: { user: string; hash: string }[];
    words: string[];
    wordlistPath: string;
    results: { user: string; hash: string; password: string | null }[];
    crackedCount: number;
}

const CrackingAnimation: React.FC<CrackingAnimationProps> = ({
    hashes,
    words,
    wordlistPath,
    results,
    crackedCount,
}) => {
    const [phase, setPhase] = useState<'cracking' | 'done'>('cracking');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    const targetDuration = 12; // seconds
    const wordsPerSecond = Math.ceil(words.length / targetDuration);

    useEffect(() => {
        if (phase === 'done') return;

        const interval = setInterval(() => {
            setCurrentWordIndex((prev) => {
                const next = prev + wordsPerSecond;
                if (next >= words.length) {
                    setPhase('done');
                    return words.length;
                }
                return next;
            });
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [phase, words.length, wordsPerSecond]);

    const formatTime = (seconds: number) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `0:${h}:${m}:${s}`;
    };

    const progress = Math.min((currentWordIndex / words.length) * 100, 100);

    if (phase === 'cracking') {
        return (
            <div>
                <div className="text-yellow-400 mb-2">
                    Loaded {hashes.length} password hash{hashes.length > 1 ? 'es' : ''}
                </div>
                <div className="text-zinc-500 mb-2">
                    Using wordlist: {wordlistPath} ({words.length} words)
                </div>
                <div className="text-zinc-500 mb-3">
                    Press 'q' or Ctrl-C to abort, 'any' to continue
                </div>
                <div className="text-zinc-500 mb-1">
                    Progress: {progress.toFixed(1)}% ({currentWordIndex}/{words.length})
                </div>
                <div className="text-zinc-400">
                    Time: {formatTime(elapsedSeconds)}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="text-yellow-400 mb-2">
                Loaded {hashes.length} password hash{hashes.length > 1 ? 'es' : ''}
            </div>
            <div className="text-zinc-500 mb-2">
                Using wordlist: {wordlistPath} ({words.length} words)
            </div>
            <div className="text-zinc-500 mb-3">
                Press 'q' or Ctrl-C to abort, 'any' to continue
            </div>

            {results.map((result, index) => (
                <div key={index} className={result.password ? 'text-green-400' : 'text-zinc-500'}>
                    {result.password ? (
                        <span>{result.password} ({result.user})</span>
                    ) : (
                        <span>No match found for {result.user}</span>
                    )}
                </div>
            ))}

            <div className="mt-3 text-zinc-400">
                {crackedCount}g {crackedCount} {formatTime(elapsedSeconds)} DONE
            </div>
            <div className="text-zinc-500">
                Session completed, {crackedCount} password hash{crackedCount !== 1 ? 'es' : ''} cracked
            </div>
        </div>
    );
};

const johnCommand: Command = {
    name: 'john',
    description: 'John the Ripper password cracker',
    execute: async (_args: string[], context: TerminalContextType) => {
        if (_args.length === 0) {
            return {
                action: 'print',
                content: (
                    <div>
                        <div>John the Ripper password cracker</div>
                        <div className="text-zinc-500">Usage: john --wordlist=&lt;wordlist&gt; &lt;hashfile&gt;</div>
                        <div className="text-zinc-500">Example: john --wordlist=rockyou.txt hash.txt</div>
                    </div>
                )
            };
        }

        // Parse arguments
        let wordlistPath: string | null = null;
        let hashFilePath: string | null = null;

        for (const arg of _args) {
            if (arg.startsWith('--wordlist=')) {
                wordlistPath = arg.substring('--wordlist='.length);
            } else if (!arg.startsWith('-')) {
                hashFilePath = arg;
            }
        }

        if (!wordlistPath) {
            return {
                action: 'print',
                content: 'Error: No wordlist specified. Use --wordlist=<file>'
            };
        }

        if (!hashFilePath) {
            return {
                action: 'print',
                content: 'Error: No hash file specified.'
            };
        }

        // Helper function to read a file
        const readFile = (filePath: string): string | null => {
            const resolved = resolvePath(context.currentPath, filePath);
            if (!resolved) return null;

            // Get directory and filename
            const fileName = resolved[resolved.length - 1];
            const dirPath = resolved.slice(0, -1);

            const dir = navigateToNode(context.fileSystem, dirPath);
            if (!dir || dir.type !== 'directory' || !dir.children) return null;

            const file = dir.children[fileName];
            if (!file || file.type !== 'file') return null;

            return file.content || '';
        };

        // Read wordlist
        const wordlistContent = readFile(wordlistPath);
        if (wordlistContent === null) {
            return {
                action: 'print',
                content: `Error: Could not open wordlist file: ${wordlistPath}`
            };
        }

        // Read hash file
        const hashFileContent = readFile(hashFilePath);
        if (hashFileContent === null) {
            return {
                action: 'print',
                content: `Error: Could not open hash file: ${hashFilePath}`
            };
        }

        // Parse wordlist
        const words = wordlistContent.split('\n').filter(w => w.trim().length > 0);

        // Parse hash file (format: user:hash or just hash)
        const hashLines = hashFileContent.split('\n').filter(l => l.trim().length > 0);
        const hashes: { user: string; hash: string }[] = [];

        for (const line of hashLines) {
            if (line.includes(':')) {
                const [user, hash] = line.split(':');
                hashes.push({ user: user.trim(), hash: hash.trim() });
            } else {
                hashes.push({ user: '?', hash: line.trim() });
            }
        }

        if (hashes.length === 0) {
            return {
                action: 'print',
                content: 'No hashes found in file.'
            };
        }

        // Simulate cracking
        const results: { user: string; hash: string; password: string | null }[] = [];
        let crackedCount = 0;

        for (const entry of hashes) {
            const password = knownHashes[entry.hash] || null;

            // Check if the password exists in the wordlist (for realism)
            if (password && words.includes(password)) {
                results.push({ ...entry, password });
                crackedCount++;
            } else {
                results.push({ ...entry, password: null });
            }
        }

        return {
            action: 'print',
            content: (
                <CrackingAnimation
                    hashes={hashes}
                    words={words}
                    wordlistPath={wordlistPath}
                    results={results}
                    crackedCount={crackedCount}
                />
            )
        };
    }
};

export default johnCommand;
