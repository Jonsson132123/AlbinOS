import type { Command, TerminalContextType } from '../types/Command';
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

const touchCommand: Command = {
    name: 'touch',
    description: 'Create an empty file',
    execute: (_args: string[], context: TerminalContextType) => {
        if (_args.length === 0) {
            return {
                action: 'print',
                content: 'usage: touch <filename>'
            };
        }

        const target = _args[0];

        // Check if target contains a path
        const lastSlash = target.lastIndexOf('/');
        let dirPath: string[];
        let fileName: string;

        if (lastSlash !== -1) {
            // Path includes directories
            const dirPart = target.substring(0, lastSlash) || '/';
            fileName = target.substring(lastSlash + 1);
            const resolved = resolvePath(context.currentPath, dirPart);
            if (!resolved) {
                return {
                    action: 'print',
                    content: `touch: cannot touch '${target}': No such file or directory`
                };
            }
            dirPath = resolved;
        } else {
            // Just a filename in current directory
            dirPath = context.currentPath;
            fileName = target;
        }

        if (!fileName) {
            return {
                action: 'print',
                content: 'usage: touch <filename>'
            };
        }

        // Navigate to the target directory
        const targetDir = navigateToNode(context.fileSystem, dirPath);

        if (!targetDir) {
            return {
                action: 'print',
                content: `touch: cannot touch '${target}': No such file or directory`
            };
        }

        if (targetDir.type !== 'directory') {
            return {
                action: 'print',
                content: `touch: cannot touch '${target}': Not a directory`
            };
        }

        // Check if file already exists
        if (targetDir.children && targetDir.children[fileName]) {
            // touch on existing file does nothing (in real systems it updates timestamp)
            return {
                action: 'none',
                content: null
            };
        }

        // Clone the filesystem and add the new file
        const newFS = deepCloneFS(context.fileSystem);
        const newTargetDir = navigateToNode(newFS, dirPath);

        if (newTargetDir && newTargetDir.type === 'directory') {
            if (!newTargetDir.children) {
                newTargetDir.children = {};
            }
            newTargetDir.children[fileName] = {
                name: fileName,
                type: 'file',
                content: ''
            };

            context.setFileSystem(newFS);
        }

        return {
            action: 'none',
            content: null
        };
    }
};

export default touchCommand;
