import type { Command } from '../types/Command';
import { navigateToNode, resolvePath, checkPathPermission } from '../utils/fileSystemUtils';

const catCommand: Command = {
    name: 'cat',
    description: 'Concatenate files to standard output',
    execute: (args, context) => {
        if (args.length === 0) {
            return { action: 'print', content: 'cat: missing file operand' };
        }

        const targetArg = args[0];
        const resolvedPath = resolvePath(context.currentPath, targetArg);

        if (!resolvedPath) {
            return { action: 'print', content: `cat: error resolving path` };
        }

        const permission = checkPathPermission(context.fileSystem, resolvedPath, context.username);
        if (!permission.allowed) {
            return { action: 'print', content: <span className="text-red-400">cat: {targetArg}: Permission denied</span> };
        }

        const targetNode = navigateToNode(context.fileSystem, resolvedPath);

        if (!targetNode) {
            return { action: 'print', content: `cat: ${targetArg}: No such file or directory` };
        }

        if (targetNode.type === 'directory') {
            return { action: 'print', content: `cat: ${targetArg}: Is a directory` };
        }

        return { action: 'print', content: targetNode.content || '' };
    }
};

export default catCommand;
