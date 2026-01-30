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
                            content: 'Available Commands:\n\nhelp   - List available commands\nclear  - Clear the terminal output\nwhoami - Display user information\npwd    - Print working directory\nls     - List directory contents\ncd     - Change directory\ncat    - Concatenate files to standard output\nbanner - Display the banner\nssh    - Connect to a remote server\nexit   - Close the ssh session\ntouch  - Create an empty file\nnano   - Edit a file\njohn   - John the Ripper password cracker',
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
                            content: '123456\npassword\n12345678\nqwerty\n123456789\nfotboll123\niloveyou\n1234567\nsunshine\nprincess\nadmin\nwelcome\n666666\nabc123\ncharlie\ndonald\npassword1\nqwerty123\nhejsan123\nsommar2024\nstockholm\ngöteborg\nmalmö123\nkungen99\nviking2000\nfotboll\nhockey123\nsvansen\nbrunstigälg99\nälansen22\nblåbär456\nrödbulansen\nkotte123\nsnöflinga\nvinter2025\njuldansen\npepparkakor\nKjellbackman123\nsallad999\nmorot123\ngurka456',
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
                                'kom-ihåg.txt': {
                                    name: 'kom-ihåg.txt',
                                    type: 'file',
                                    content: 'ssh inlogg\ntyrell@72.78.13.162\nKjellbackman123',
                                },
                            }
                        }
                    }
                }
            }
        }
    }
};
