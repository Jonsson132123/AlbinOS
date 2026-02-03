import type { FileSystemNode } from '../types/FileSystem';

// Helper to find a node based on an absolute path array
export const navigateToNode = (root: FileSystemNode, path: string[]): FileSystemNode | null => {
    let currentNode = root;

    // If path is empty, we are at root (assuming root is the starting point passed)
    // However, our state has 'root' as the top level, but 'currentPath' often starts after it?
    // Let's assume standard logic: currentPath usually excludes the root name itself in traversal, 
    // or we treat 'root' as the container. 
    // Given initial state: root -> home -> guest.
    // If path is ['home', 'guest'], we traverse.

    for (const segment of path) {
        if (!currentNode.children || !currentNode.children[segment]) {
            return null;
        }
        currentNode = currentNode.children[segment];
    }
    return currentNode;
};

// Helper to resolve a target path string (e.g. "../skills" or "projects") relative to current path
export const resolvePath = (currentPath: string[], targetPath: string): string[] | null => {
    const parts = targetPath.split('/').filter(p => p.length > 0);
    const newPath = targetPath.startsWith('/') ? [] : [...currentPath];

    for (const part of parts) {
        if (part === '.') continue;
        if (part === '..') {
            if (newPath.length > 0) {
                newPath.pop();
            }
        } else {
            newPath.push(part);
        }
    }
    return newPath;
};

// Check if user has permission to access the path (checks all nodes along the path)
export const checkPathPermission = (root: FileSystemNode, path: string[], username: string): { allowed: boolean; deniedAt?: string } => {
    let currentNode = root;

    for (const segment of path) {
        if (!currentNode.children || !currentNode.children[segment]) {
            return { allowed: true }; // Node doesn't exist, let other error handling deal with it
        }
        currentNode = currentNode.children[segment];

        if (currentNode.requiredUser && currentNode.requiredUser !== username) {
            return { allowed: false, deniedAt: segment };
        }
    }
    return { allowed: true };
};
