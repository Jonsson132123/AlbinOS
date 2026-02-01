import type { Command, CommandOutput, TerminalContextType } from '../types/Command';

interface UserConfig {
    password: string;
    homePath: string[];
}

interface SystemUsers {
    [username: string]: UserConfig;
}

interface Systems {
    [hostname: string]: SystemUsers;
}

const systemUsers: Systems = {
    'AlbinOS-Desktop': {
        'root': { password: 'toor', homePath: ['home', 'guest'] },
        'albin': { password: 'albin123', homePath: ['home', 'albin'] },
    },
    '72.78.13.162': {
        'root': { password: 'brunstigälg99', homePath: ['home', 'root'] },
        'tyrell': { password: 'Kjellbackman123', homePath: ['home', 'tyrell'] },
    },
};

export const su: Command = {
    name: 'su',
    description: 'Switch user',
    execute: async (args: string[], context: TerminalContextType): Promise<CommandOutput> => {
        if (args.length === 0) {
            return { action: 'print', content: 'usage: su <username>' };
        }

        const targetUser = args[0];
        const currentSystem = systemUsers[context.hostname];

        if (!currentSystem) {
            return { action: 'print', content: 'su: system not recognized' };
        }

        const userConfig = currentSystem[targetUser];

        if (!userConfig) {
            const availableUsers = Object.keys(currentSystem).join(', ');
            return { action: 'print', content: `su: user ${targetUser} does not exist. Available users: ${availableUsers}` };
        }

        if (targetUser === context.username) {
            return { action: 'print', content: `su: already logged in as ${targetUser}` };
        }

        const checkPassword = async (input: string): Promise<CommandOutput> => {
            context.unregisterInputHandler();

            if (input === userConfig.password) {
                context.setUsername(targetUser);

                return {
                    action: 'print',
                    content: `Switched to user ${targetUser}`
                };
            } else {
                return { action: 'print', content: 'su: Authentication failure' };
            }
        };

        context.registerInputHandler(checkPassword);

        return {
            action: 'print',
            content: 'Password:'
        };
    }
};

export default su;
