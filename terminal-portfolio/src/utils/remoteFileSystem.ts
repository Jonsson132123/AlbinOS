import type { FileSystemNode } from '../types/FileSystem';

export const remoteFileSystem: FileSystemNode = {
    name: 'root',
    type: 'directory',
    children: {
        'var': {
            name: 'var',
            type: 'directory',
            children: {
                'ecorp_backups': {
                    name: 'ecorp_backups',
                    type: 'directory',
                    children: {
                        'shadow.bak': {
                            name: 'shadow.bak',
                            type: 'file',
                            content: 'root:8ebe0716326076a5bfc67b58b97087fa'
                        },
                        'passwd.bak': {
                            name: 'passwd.bak',
                            type: 'file',
                            content: 'root:x:0:0:root:/root:/bin/bash'
                        }
                    }
                }
            }
        },
        'home': {
            name: 'home',
            type: 'directory',
            children: {
                'root': {
                    name: 'root',
                    type: 'directory',
                    children: {
                        'flagga.txt': {
                            name: 'flagga.txt',
                            type: 'file',
                            content: '1337 ELITE HACKER'
                        }
                    }
                },
                'tyrell': {
                    name: 'tyrell',
                    type: 'directory',
                    children: {
                        'todo.txt': {
                            name: 'todo.txt',
                            type: 'file',
                            content: 'Become CTO of this company.'
                        }
                    }
                }
            }
        },
    }
};
