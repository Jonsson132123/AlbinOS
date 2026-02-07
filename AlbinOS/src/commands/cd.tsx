import type { Command } from '../types/Command';
import { navigateToNode, resolvePath, checkPathPermission } from '../utils/fileSystemUtils';

const cdCommand: Command = {
    name: 'cd',
    description: 'Change directory',
    execute: (args, context) => {
        if (args.length === 0) {
            // Default to guest home
            context.setCurrentPath(['home', 'guest']);
            return { action: 'none' };
        }

        const targetArg = args[0];
        const resolvedPath = resolvePath(context.currentPath, targetArg);

        if (!resolvedPath) {
            return { action: 'print', content: `cd: error resolving path` };
        }

        const permission = checkPathPermission(context.fileSystem, resolvedPath, context.username);
        if (!permission.allowed) {
            return { action: 'print', content: <span className="text-red-400">cd: {targetArg}: Permission denied</span> };
        }

        const targetNode = navigateToNode(context.fileSystem, resolvedPath);

        if (!targetNode) {
            return { action: 'print', content: `cd: ${targetArg}: No such file or directory` };
        }

        if (targetNode.type !== 'directory') {
            return { action: 'print', content: `cd: ${targetArg}: Not a directory` };
        }

        context.setCurrentPath(resolvedPath);
        return { action: 'none' };
    }
};

export default cdCommand;
