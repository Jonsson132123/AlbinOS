import type { Command } from '../types/Command';

const pwdCommand: Command = {
    name: 'pwd',
    description: 'Print working directory',
    execute: (_args, context) => {
        const pathStr = '/' + context.currentPath.join('/');
        return {
            action: 'print',
            content: pathStr
        };
    }
};

export default pwdCommand;
