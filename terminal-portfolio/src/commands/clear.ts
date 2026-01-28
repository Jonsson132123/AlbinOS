import type { Command } from '../types/Command';

const clearCommand: Command = {
    name: 'clear',
    description: 'Clear the terminal output',
    execute: () => {
        return {
            action: 'clear'
        };
    }
};

export default clearCommand;
