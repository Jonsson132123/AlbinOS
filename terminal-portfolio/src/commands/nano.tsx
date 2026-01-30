import React from 'react';
import type { Command, CommandOutput, TerminalContextType } from '../types/Command';
import type { FileSystemNode } from '../types/FileSystem';
import { navigateToNode, resolvePath } from '../utils/fileSystemUtils';

// Deep clone the filesystem to avoid mutating state directly
const deepCloneFS = (node: FileSystemNode): FileSystemNode => {
    const clone: FileSystemNode = {
        name: node.name,
        type: node.type,
    };
    if (node.content !== undefined) {
        clone.content = node.content;
    }
    if (node.children) {
        clone.children = {};
        for (const key in node.children) {
            clone.children[key] = deepCloneFS(node.children[key]);
        }
    }
    return clone;
};

const nanoCommand: Command = {
    name: 'nano',
    description: 'Edit a file',
    execute: (_args: string[], context: TerminalContextType) => {
        if (_args.length === 0) {
            return {
                action: 'print',
                content: 'usage: nano <filename>'
            };
        }

        const target = _args[0];

        // Parse path and filename
        const lastSlash = target.lastIndexOf('/');
        let dirPath: string[];
        let fileName: string;

        if (lastSlash !== -1) {
            const dirPart = target.substring(0, lastSlash) || '/';
            fileName = target.substring(lastSlash + 1);
            const resolved = resolvePath(context.currentPath, dirPart);
            if (!resolved) {
                return {
                    action: 'print',
                    content: `nano: ${target}: No such file or directory`
                };
            }
            dirPath = resolved;
        } else {
            dirPath = context.currentPath;
            fileName = target;
        }

        if (!fileName) {
            return {
                action: 'print',
                content: 'usage: nano <filename>'
            };
        }

        // Navigate to the target directory
        const targetDir = navigateToNode(context.fileSystem, dirPath);

        if (!targetDir || targetDir.type !== 'directory') {
            return {
                action: 'print',
                content: `nano: ${target}: No such file or directory`
            };
        }

        // Get existing file content or empty for new file
        const existingFile = targetDir.children?.[fileName];
        let currentContent = '';
        const isNewFile = !existingFile;

        if (existingFile) {
            if (existingFile.type === 'directory') {
                return {
                    action: 'print',
                    content: `nano: ${target}: Is a directory`
                };
            }
            currentContent = existingFile.content || '';
        }

        // Buffer to store the new content
        const lines: string[] = currentContent ? currentContent.split('\n') : [];

        const handleInput = async (input: string): Promise<CommandOutput> => {
            // Commands
            if (input === ':w') {
                // Save without exiting
                saveFile();
                return {
                    action: 'print',
                    content: `"${fileName}" saved`
                };
            }

            if (input === ':q') {
                // Quit without saving
                context.unregisterInputHandler();
                return {
                    action: 'print',
                    content: 'Exited nano (changes discarded)'
                };
            }

            if (input === ':wq' || input === ':x') {
                // Save and quit
                saveFile();
                context.unregisterInputHandler();
                return {
                    action: 'print',
                    content: `"${fileName}" saved`
                };
            }

            if (input === ':help') {
                return {
                    action: 'print',
                    content: ':w = save | :q = quit | :wq = save & quit | :clear = clear all'
                };
            }

            if (input === ':clear') {
                lines.length = 0;
                return {
                    action: 'print',
                    content: '(content cleared)'
                };
            }

            if (input === ':show') {
                return {
                    action: 'print',
                    content: lines.length > 0 ? lines.join('\n') : '(empty)'
                };
            }

            // Regular input - add line to buffer
            lines.push(input);
            return {
                action: 'none',
                content: null
            };
        };

        const saveFile = () => {
            const newFS = deepCloneFS(context.fileSystem);
            const newTargetDir = navigateToNode(newFS, dirPath);

            if (newTargetDir && newTargetDir.type === 'directory') {
                if (!newTargetDir.children) {
                    newTargetDir.children = {};
                }
                newTargetDir.children[fileName] = {
                    name: fileName,
                    type: 'file',
                    content: lines.join('\n')
                };
                context.setFileSystem(newFS);
            }
        };

        // Register the input handler
        context.registerInputHandler(handleInput);

        return {
            action: 'print',
            content: (
                <div>
                    <div className="text-green-400 font-bold">GNU nano - {isNewFile ? 'New File' : fileName}</div>
                    <div className="text-zinc-500 text-sm mb-2">:w = save | :q = quit | :wq = save & quit | :help = help</div>
                    {currentContent && (
                        <div className="border-l-2 border-zinc-600 pl-2 mb-2">
                            <div className="text-zinc-500 text-sm">Current content:</div>
                            <div className="text-zinc-300">{currentContent}</div>
                        </div>
                    )}
                    <div className="text-zinc-500 text-sm">Type text below. Each line is added to the file.</div>
                </div>
            )
        };
    }
};

export default nanoCommand;
