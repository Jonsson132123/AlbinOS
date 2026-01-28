import type { FileSystemNode } from '../types/FileSystem';

export const initialFileSystem: FileSystemNode = {
    name: 'root',
    type: 'directory',
    children: {
        'home': {
            name: 'home',
            type: 'directory',
            children: {
                'guest': {
                    name: 'guest',
                    type: 'directory',
                    children: {
                        'commands.txt': {
                            name: 'commands.txt',
                            type: 'file',
                            content: 'Available Commands:\n\nhelp   - List available commands\nclear  - Clear the terminal output\nwhoami - Display user information\npwd    - Print working directory\nls     - List directory contents\ncd     - Change directory\ncat    - Concatenate files to standard output\nbanner - Display the banner\nssh    - Connect to a remote server\nexit   - Close the ssh session',
                        },
                    }
                },
                'albin': {
                    name: 'albin',
                    type: 'directory',
                    children: {
                        'about.txt': {
                            name: 'about.txt',
                            type: 'file',
                            content: 'Namn: Albin\nÅlder: 22',
                        },
                        'rockyou.txt': {
                            name: 'rockyou.txt',
                            type: 'file',
                            content: 'password123\nKjellbackman123\n123456\n123456789\n1234567890\n12345678901234567890',
                        },
                        'projects': {
                            name: 'projects',
                            type: 'directory',
                            children: {}
                        },
                        'skills': {
                            name: 'skills',
                            type: 'directory',
                            children: {}
                        },
                        'hemligt': {
                            name: 'hemligt',
                            type: 'directory',
                            children: {
                                'Filip-Poon-Wok.txt': {
                                    name: 'Filip-Poon-Wok.txt',
                                    type: 'file',
                                    content: 'Filip-Poon Kyckling wok med broccoli och cashewnötter\n\n500g kycklinglårfile, strimlad\n500g broccoli\n1 röd paprika\n4klyftor vitlök\n4cm färsk ingefära\n1 dl rostade cashewnötter\n65 g babyspenat\n3 msk japansk soja\n1 msk ostronsås\n1 msk sesamolja\n1 tsk strösocker\nrapsolja, till stekning',
                                },
                                'passwd.txt': {
                                    name: 'passwd.txt',
                                    type: 'file',
                                    content: 'ssh inlogg\nchewbacca@72.78.13.162\nKjellbackman123',
                                },
                            }
                        }
                    }
                }
            }
        }
    }
};
