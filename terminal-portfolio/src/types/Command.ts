import type { FileSystemNode } from './FileSystem';
import React from 'react';

export interface CommandOutput {
    action: 'print' | 'clear' | 'none';
    content?: React.ReactNode;
}

export interface TerminalContextType {
    currentPath: string[]; // e.g. ['home', 'guest']
export interface TerminalContextType {
    currentPath: string[]; // e.g. ['home', 'guest']
    fileSystem: FileSystemNode;
    setFileSystem: (newFs: FileSystemNode) => void;
    setCurrentPath: (path: string[]) => void;
    username: string;
    hostname: string;
    setUsername: (name: string) => void;
    setHostname: (host: string) => void;
    registerInputHandler: (handler: (input: string) => Promise<CommandOutput>) => void;
    unregisterInputHandler: () => void;
}

export interface Command {
    name: string;
    description: string;
    execute: (args: string[], context: TerminalContextType) => CommandOutput | Promise<CommandOutput>;
}
