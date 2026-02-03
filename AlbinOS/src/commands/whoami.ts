import type { Command, TerminalContextType } from '../types/Command';

const whoamiCommand: Command = {
    name: 'whoami',
    description: 'Display user information',
    execute: (_args: string[], context: TerminalContextType) => {
        return {
            action: 'print',
            content: `${context.username}@${context.hostname}`
        };
    }
};

export default whoamiCommand;
