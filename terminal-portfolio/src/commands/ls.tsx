import type { Command } from '../types/Command';
import { navigateToNode, resolvePath, checkPathPermission } from '../utils/fileSystemUtils';
import React from 'react';

const lsCommand: Command = {
    name: 'ls',
    description: 'List directory contents',
    execute: (args, context) => {
        // Check for -l flag
        const longFormat = args.includes('-l');
        const pathArgs = args.filter(arg => arg !== '-l');

        let targetPath = context.currentPath;

        if (pathArgs.length > 0) {
            const resolved = resolvePath(context.currentPath, pathArgs[0]);
            if (!resolved) {
                return { action: 'print', content: `ls: cannot access '${pathArgs[0]}': No such file or directory` };
            }
            targetPath = resolved;
        }

        const permission = checkPathPermission(context.fileSystem, targetPath, context.username);
        if (!permission.allowed) {
            return { action: 'print', content: `ls: cannot open directory '${pathArgs[0] || '.'}': Permission denied` };
        }

        const node = navigateToNode(context.fileSystem, targetPath);

        if (!node) {
            return { action: 'print', content: `ls: cannot access '${pathArgs[0]}': No such file or directory` };
        }

        if (node.type === 'file') {
            return { action: 'print', content: node.name };
        }

        if (node.children) {
            const childrenKeys = Object.keys(node.children);

            if (longFormat) {
                // Long format listing
                const content = (
                    <div className="flex flex-col gap-1">
                        {childrenKeys.map(key => {
                            const child = node.children![key];
                            const isDir = child.type === 'directory';
                            const fileType = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
                            const size = isDir ? '-' : (child.content?.length.toString() || '0');

                            return (
                                <div key={key} className="flex flex-row gap-4 font-mono">
                                    <span className="text-zinc-500">{fileType}</span>
                                    <span className="text-zinc-500 w-16 text-right">{size}</span>
                                    <span className={isDir ? 'text-blue-400 font-bold' : 'text-zinc-300'}>
                                        {key}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                );
                return { action: 'print', content };
            } else {
                // Normal format listing
                const content = (
                    <div className="flex flex-row gap-4 flex-wrap">
                        {childrenKeys.map(key => {
                            const child = node.children![key];
                            const isDir = child.type === 'directory';
                            return (
                                <span key={key} className={isDir ? 'text-blue-400 font-bold' : 'text-zinc-300'}>
                                    {key}
                                </span>
                            );
                        })}
                    </div>
                );
                return { action: 'print', content };
            }
        }

        return { action: 'print', content: '' };
    }
};

export default lsCommand;
