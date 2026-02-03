import type { Command } from '../types/Command';

const helpCommand: Command = {
    name: 'help',
    description: 'List available commands',
    execute: () => {
        const helpText = `
Available Commands:

help       - List available commands
clear      - Clear the terminal output
whoami     - Display user information
pwd        - Print working directory
cat        - Concatenate files to standard output
ls         - List directory contents
cd         - Change directory
        `;
        return {
            action: 'print',
            content: helpText.trim()
        };
    }
};

export default helpCommand;
