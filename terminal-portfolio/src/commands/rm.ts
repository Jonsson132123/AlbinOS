import type { Command } from '../types/Command';
import { navigateToNode, resolvePath } from '../utils/fileSystemUtils';
import type { FileSystemNode } from '../types/FileSystem';

const rmCommand: Command = {
    name: 'rm',
    description: 'Remove files or directories',
    execute: (args, context) => {
        if (args.length === 0) {
            return { action: 'print', content: 'rm: missing operand' };
        }

        // Parse flags
        let recursive = false;
        const paths: string[] = [];

        for (const arg of args) {
            if (arg === '-r' || arg === '-R' || arg === '--recursive') {
                recursive = true;
            } else if (arg.startsWith('-')) {
                // Check for combined flags like -rf
                if (arg.includes('r') || arg.includes('R')) {
                    recursive = true;
                }
            } else {
                paths.push(arg);
            }
        }

        if (paths.length === 0) {
            return { action: 'print', content: 'rm: missing operand' };
        }

        const errors: string[] = [];

        for (const targetPath of paths) {
            const resolved = resolvePath(context.currentPath, targetPath);

            if (!resolved || resolved.length === 0) {
                errors.push(`rm: cannot remove '${targetPath}': No such file or directory`);
                continue;
            }

            const targetName = resolved[resolved.length - 1];
            const parentPath = resolved.slice(0, -1);

            const parentNode = navigateToNode(context.fileSystem, parentPath);

            if (!parentNode || !parentNode.children || !parentNode.children[targetName]) {
                errors.push(`rm: cannot remove '${targetPath}': No such file or directory`);
                continue;
            }

            const targetNode = parentNode.children[targetName];

            if (targetNode.type === 'directory') {
                if (!recursive) {
                    errors.push(`rm: cannot remove '${targetPath}': Is a directory`);
                    continue;
                }

                // Check if directory has children
                const hasChildren = targetNode.children && Object.keys(targetNode.children).length > 0;
                if (hasChildren && !recursive) {
                    errors.push(`rm: cannot remove '${targetPath}': Directory not empty`);
                    continue;
                }
            }

            // Remove the node
            const newFileSystem = deepCloneFileSystem(context.fileSystem);
            const newParent = navigateToNode(newFileSystem, parentPath);

            if (newParent && newParent.children) {
                delete newParent.children[targetName];
                context.setFileSystem(newFileSystem);
            }
        }

        if (errors.length > 0) {
            return { action: 'print', content: errors.join('\n') };
        }

        return { action: 'none' };
    }
};

// Deep clone the file system to avoid mutating state directly
function deepCloneFileSystem(node: FileSystemNode): FileSystemNode {
    const clone: FileSystemNode = {
        type: node.type,
        name: node.name,
    };

    if (node.content !== undefined) {
        clone.content = node.content;
    }

    if (node.children) {
        clone.children = {};
        for (const [key, child] of Object.entries(node.children)) {
            clone.children[key] = deepCloneFileSystem(child);
        }
    }

    return clone;
}

export default rmCommand;
