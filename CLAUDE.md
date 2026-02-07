# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AlbinOS is a terminal-based portfolio application built with React and TypeScript. It simulates a Unix/Linux terminal where users can explore a virtual file system and complete a Capture-the-Flag (CTF) cybersecurity challenge. The project is written in Swedish.

## Development Commands

All commands run from `terminal-portfolio/`:

```bash
npm run dev      # Start Vite development server
npm run build    # TypeScript compile + Vite production build
npm run preview  # Preview production build
```

No linting or test commands are configured.

## Architecture

### Tech Stack
- React 19 + TypeScript (strict mode)
- Vite 7 build system
- Tailwind CSS v4

### Core Structure

```
terminal-portfolio/src/
├── commands/          # Command implementations
├── components/        # Terminal.tsx, BootSequence.tsx
├── hooks/             # useTerminal.tsx - terminal state management
├── types/             # Command.ts, FileSystem.ts
├── utils/
│   ├── commandRegistry.ts    # Singleton command registry
│   ├── registerCommands.ts   # Command registration
│   ├── fileSystemUtils.ts    # Path navigation utilities
│   ├── initialFileSystem.ts  # Local file system tree
│   └── remoteFileSystem.ts   # SSH target file system
└── App.tsx            # Boot sequence → Terminal flow
```

### Command System

Commands implement the `Command` interface:

```typescript
interface Command {
    name: string;
    description: string;
    execute: (args: string[], context: TerminalContextType) => CommandOutput | Promise<CommandOutput>;
}
```

**Adding a new command:**
1. Create file in `src/commands/` (use `.tsx` if returning JSX, `.ts` otherwise)
2. Export command object implementing `Command` interface
3. Import and register in `src/utils/registerCommands.ts`

Commands return `CommandOutput` with action: `'print'` (display content), `'clear'`, or `'none'`.

### File System

In-memory tree structure with `FileSystemNode` type. Two separate file systems exist:
- **Local** (`initialFileSystem.ts`): Default `/home/guest` environment
- **Remote** (`remoteFileSystem.ts`): SSH target with CTF content

Path utilities in `fileSystemUtils.ts`:
- `navigateToNode(root, path[])` - traverse to node
- `resolvePath(currentPath[], targetPath)` - resolve relative/absolute paths

### Terminal Context

`TerminalContextType` passed to all commands provides:
- `currentPath`, `fileSystem`, `setFileSystem`, `setCurrentPath`
- `username`, `hostname`, `setUsername`, `setHostname`
- `registerInputHandler`, `unregisterInputHandler` - for interactive commands (SSH password, nano editor)

### Input Handler Pattern

For multi-step interactive commands (e.g., SSH password prompt), use:
```typescript
context.registerInputHandler(async (input) => {
    // Handle user input
    context.unregisterInputHandler();
    return { action: 'print', content: '...' };
});
```

## CTF Challenge

The application includes a password-cracking CTF:
- SSH connection to remote system
- Hash file at `/var/ecorp_backups/shadow.bak`
- Wordlist at `/home/albin/rockyou.txt`
- `john` command for hash cracking

## Conventions

- Git commit messages are in Swedish
- Terminal styling uses Tailwind utility classes
- Directories render in blue (`text-blue-400`)
- SSH sessions use green styling (`text-green-300`)
