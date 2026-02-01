import React, { useState, useCallback } from 'react';
import { initialFileSystem } from '../utils/initialFileSystem';
import { commandRegistry } from '../utils/commandRegistry';
import type { FileSystemNode } from '../types/FileSystem';
import type { TerminalContextType, CommandOutput } from '../types/Command';
import { config } from '../config';


export interface HistoryItem {
    command: string;
    output: CommandOutput;
    path: string[];
    username: string;
    hostname: string;
    hidePrompt?: boolean;
}

import { banner } from '../utils/banner';
// ... imports ...

export const useTerminal = () => {
    // Determine initial path based on user
    const getInitialPath = () => {
        return ['home', 'root'];
    };

    const initialBannerItem: HistoryItem = {
        command: 'banner',
        output: {
            action: 'print',
            content: (
                <div className="whitespace-pre-wrap text-blue-400 font-bold leading-none" >
                    {banner}
                </div>
            )
        },
        path: getInitialPath(),
        username: config.username,
        hostname: config.hostname,
        hidePrompt: true
    };

    const [fileSystem, setFileSystem] = useState<FileSystemNode>(initialFileSystem);
    const [currentPath, setCurrentPath] = useState<string[]>(getInitialPath());
    const [history, setHistory] = useState<HistoryItem[]>([initialBannerItem]);
    const [username, setUsername] = useState(config.username);
    const [hostname, setHostname] = useState(config.hostname);
    const [inputHandler, setInputHandler] = useState<((input: string) => Promise<CommandOutput>) | null>(null);

    // Terminal Context to be passed to commands
    const terminalContext: TerminalContextType = {
        currentPath,
        fileSystem,
        setFileSystem,
        setCurrentPath,
        username,
        hostname,
        setUsername,
        setHostname,
        registerInputHandler: (handler) => setInputHandler(() => handler),
        unregisterInputHandler: () => setInputHandler(null),
    };

    const executeCommand = useCallback(async (cmdStr: string) => {
        // If we have an active input handler, route input there instead of normal command parsing
        if (inputHandler) {
            let output: CommandOutput;
            try {
                output = await inputHandler(cmdStr);
            } catch (error) {
                output = { action: 'print', content: `Error: ${error instanceof Error ? error.message : String(error)}` };
            }

            // If the handler didn't clear itself (it might need multiple inputs), we keep it.
            // But usually, commands will unregister themselves when done.

            setHistory(prev => [...prev, { command: cmdStr, output, path: currentPath, username, hostname, hidePrompt: true }]); // Hide prompt for inputs usually? Or keep it? 
            // Actually, for SSH password, we usually want to hide the input command itself or show it. 
            // Standard terminal shows the input (unless it's a password field where it's hidden).
            // The user asked for "prompts for password". 
            // Let's assume standard behavior: we log the input. Password masking is a UI concern we might not fully solve here without more UI state.
            // For now, let's just log it.
            return;
        }

        if (!cmdStr.trim()) {
            const emptyOutput: CommandOutput = { action: 'none', content: null };
            setHistory(prev => [...prev, { command: '', output: emptyOutput, path: currentPath, username, hostname }]);
            return;
        }

        const [cmdName, ...args] = cmdStr.trim().split(/\s+/);
        const command = commandRegistry.getCommand(cmdName);

        let output: CommandOutput;

        if (command) {
            try {
                output = await command.execute(args, terminalContext);
            } catch (error) {
                output = { action: 'print', content: `Error: ${error instanceof Error ? error.message : String(error)}` };
            }
        } else {
            output = { action: 'print', content: `Command not found: ${cmdName}. Type "help" for a list of commands.` };
        }

        if (output.action === 'clear') {
            setHistory([]);
        } else {
            setHistory(prev => [...prev, { command: cmdStr, output, path: currentPath, username, hostname }]);
        }

    }, [currentPath, fileSystem, inputHandler]); // Dependencies might need tuning

    return {
        history,
        currentPath,
        executeCommand,
        username,
        hostname,
        inputHandler
    };
};
