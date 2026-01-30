import type { FileSystemNode } from '../types/FileSystem';

export const remoteFileSystem: FileSystemNode = {
    name: 'root',
    type: 'directory',
    children: {
        'var': {
            name: 'var',
            type: 'directory',
            children: {
                'backups': {
                    name: 'backups',
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
                'tyrell': {
                    name: 'tyrell',
                    type: 'directory',
                    children: {
                        'secrets.txt': {
                            name: 'secrets.txt',
                            type: 'file',
                            content: ''
                        },
                        'admin_notes.txt': {
                            name: 'admin_notes.txt',
                            type: 'file',
                            content: 'TODO: Byt lösenord på alla servrar. "123456" är inte säkert.',
                        }
                    }
                }
            }
        }
    }
};
