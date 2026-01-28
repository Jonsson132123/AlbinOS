import type { FileSystemNode } from '../types/FileSystem';

export const remoteFileSystem: FileSystemNode = {
    name: 'root',
    type: 'directory',
    children: {
        'home': {
            name: 'home',
            type: 'directory',
            children: {
                'chewbacca': {
                    name: 'chewbacca',
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
