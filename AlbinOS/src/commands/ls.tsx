import type { Command } from '../types/Command';
import type { FileSystemNode } from '../types/FileSystem';
import { navigateToNode, resolvePath, checkPathPermission } from '../utils/fileSystemUtils';
import React from 'react';

// Rekursiv funktion för att lista alla filer och mappar
const listRecursive = (node: FileSystemNode, path: string, username: string, indent: number = 0): React.ReactNode[] => {
    const results: React.ReactNode[] = [];

    if (node.children) {
        const childrenKeys = Object.keys(node.children).sort();

        for (const key of childrenKeys) {
            const child = node.children[key];
            const isDir = child.type === 'directory';
            const currentPath = path ? `${path}/${key}` : key;

            // Kolla behörighet för denna nod
            const hasPermission = !child.requiredUser || child.requiredUser === username;

            if (!hasPermission) {
                // Visa permission denied för denna mapp
                results.push(
                    <div key={currentPath} style={{ marginLeft: `${indent * 1.5}rem` }}>
                        <span className="text-red-400">
                            {key}: Permission denied
                        </span>
                    </div>
                );
                // Fortsätt till nästa utan att lista innehållet
                continue;
            }

            results.push(
                <div key={currentPath} style={{ marginLeft: `${indent * 1.5}rem` }}>
                    <span className={isDir ? 'text-blue-400 font-bold' : 'text-zinc-300'}>
                        {key}
                    </span>
                </div>
            );

            // Rekursivt lista undermappar
            if (isDir && child.children) {
                results.push(...listRecursive(child, currentPath, username, indent + 1));
            }
        }
    }

    return results;
};

const lsCommand: Command = {
    name: 'ls',
    description: 'List directory contents',
    execute: (args, context) => {
        // Check for flags (case-insensitive för -r)
        const longFormat = args.includes('-l');
        const recursive = args.some(arg => arg.toLowerCase() === '-r');
        const pathArgs = args.filter(arg => arg !== '-l' && arg.toLowerCase() !== '-r');

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

            // Rekursiv listning
            if (recursive) {
                const recursiveContent = listRecursive(node, '', context.username);
                if (recursiveContent.length === 0) {
                    return { action: 'print', content: '' };
                }
                return {
                    action: 'print',
                    content: <div className="flex flex-col">{recursiveContent}</div>
                };
            }

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
