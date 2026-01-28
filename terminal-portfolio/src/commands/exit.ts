import type { Command, TerminalContextType } from '../types/Command';
import { config } from '../config';
import { initialFileSystem } from '../utils/initialFileSystem';

const exitCommand: Command = {
    name: 'exit',
    description: 'Exit the current SSH session',
    execute: (_args: string[], context: TerminalContextType) => {
        // Check if we're in an SSH session (not the default user)
        if (context.username === config.username && context.hostname === config.hostname) {
            return {
                action: 'print',
                content: 'Not in an SSH session.'
            };
        }

        // Reset to default values
        context.setUsername(config.username);
        context.setHostname(config.hostname);
        context.setFileSystem(initialFileSystem);
        context.setCurrentPath(['home', 'guest']);

        return {
            action: 'print',
            content: 'Connection to remote host closed.'
        };
    }
};

export default exitCommand;
