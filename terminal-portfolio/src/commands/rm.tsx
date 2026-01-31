import React, { useState, useEffect } from 'react';
import type { Command } from '../types/Command';
import { navigateToNode, resolvePath } from '../utils/fileSystemUtils';
import type { FileSystemNode } from '../types/FileSystem';

const BlueScreenOfDeath: React.FC = () => {
    const [phase, setPhase] = useState<'freeze' | 'bsod'>('freeze');

    useEffect(() => {
        const timer = setTimeout(() => {
            setPhase('bsod');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (phase === 'freeze') {
        return <div className="text-zinc-500">Removing files...</div>;
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#0071ceff',
                color: 'white',
                fontFamily: 'Segoe UI, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '50px',
                zIndex: 9999,
            }}
        >
            <div style={{ fontSize: '120px', marginBottom: '20px' }}>:(</div>
            <div style={{ marginTop: '40px', fontSize: '14px' }}>
                Stop code: CRITICAL_PROCESS_DIED
            </div>
        </div>
    );
};

const rmCommand: Command = {
    name: 'rm',
    description: 'Remove files or directories',
    execute: (args, context) => {
        if (args.length === 0) {
            return { action: 'print', content: 'rm: missing operand' };
        }

        // Parse flags
        let recursive = false;
        let force = false;
        const paths: string[] = [];

        for (const arg of args) {
            if (arg === '-r' || arg === '-R' || arg === '--recursive') {
                recursive = true;
            } else if (arg === '-f' || arg === '-F' || arg === '--force') {
                force = true;
            } else if (arg === '-rf' || arg === '-rF' || arg === '-Rf' || arg === '-RF') {
                recursive = true;
                force = true;
            } else if (arg.startsWith('-')) {
                // Check for combined flags like -rf
                if (arg.includes('r') || arg.includes('R')) {
                    recursive = true;
                }
                if (arg.includes('f') || arg.includes('F')) {
                    force = true;
                }
            } else {
                paths.push(arg);
            }
        }

        if (paths.length === 0) {
            return { action: 'print', content: 'rm: missing operand' };
        }

        // Check for root deletion attempt
        const isRootDeletion = paths.some(p => p === '/' || p === '/*');

        if (isRootDeletion) {
            if (!recursive) {
                return {
                    action: 'print',
                    content: 'rm: cannot remove \'/\': Is a directory'
                };
            }

            if (recursive && !force) {
                return {
                    action: 'print',
                    content: (
                        <div>
                            <div className="text-red-400">rm: it is dangerous to operate recursively on '/'</div>
                            <div className="text-yellow-400">rm: use --force (-F) if you really want to delete all files on the system</div>
                        </div>
                    )
                };
            }

            // rm -rF / - trigger BSOD
            if (recursive && force) {
                return {
                    action: 'print',
                    content: <BlueScreenOfDeath />
                };
            }
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
