export type FileType = 'file' | 'directory';

export interface FileSystemNode {
    name: string;
    type: FileType;
    content?: string; // Content for files
    children?: { [key: string]: FileSystemNode }; // Children for directories
    parent?: FileSystemNode | null; // Reference to parent for easier traversal, but serializing might be tricky if we save state. We'll handle parent links dynamically or via path.
    requiredUser?: string; // User required to access this node
}

export type FileSystemState = {
    [key: string]: FileSystemNode;
};
