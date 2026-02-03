import type { Command, CommandOutput, TerminalContextType } from '../types/Command';
import { remoteFileSystem } from '../utils/remoteFileSystem';

export const ssh: Command = {
    name: 'ssh',
    description: 'Connect to a remote server',
    execute: async (args: string[], context: TerminalContextType): Promise<CommandOutput> => {
        if (args.length === 0) {
            return { action: 'print', content: 'usage: ssh user@host' };
        }

        const target = args[0];

        // Simulating delay?
        // await new Promise(resolve => setTimeout(resolve, 500)); 

        const validLogins: { [key: string]: { password: string; homePath: string[] } } = {
            'tyrell@72.78.13.162': { password: 'Kjellbackman123', homePath: ['home', 'tyrell'] },
            'root@72.78.13.162': { password: 'brunstigälg99', homePath: ['home', 'root'] },
        };

        const checkPassword = async (input: string): Promise<CommandOutput> => {
            const loginInfo = validLogins[target];

            if (loginInfo && input === loginInfo.password) {
                const username = target.split('@')[0];
                context.setUsername(username);
                context.setHostname('72.78.13.162');
                context.setFileSystem(remoteFileSystem);
                context.setCurrentPath(loginInfo.homePath);
                context.unregisterInputHandler();

                return {
                    action: 'print',
                    content: (
                        <div>
                            <div>Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-150-generic x86_64)</div>
                            <br />
                            <div> * Documentation: https://help.ubuntu.com</div>
                            <div> * Management: https://landscape.canonical.com</div>
                            <div> * Support: https://ubuntu.com/advantage</div>
                            <br />
                            <div>Last login: Tue Jan 20 17:30:00 2026 from 192.168.1.5</div>
                        </div>
                    )
                };
            } else {
                context.unregisterInputHandler();
                return { action: 'print', content: 'Permission denied, please try again.' };
            }
        };

        context.registerInputHandler(checkPassword);

        return {
            action: 'print',
            content: `${target}'s password:`
        };
    }
};
