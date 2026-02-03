import type { Command } from '../types/Command';

class CommandRegistry {
    private commands: { [key: string]: Command } = {};

    register(command: Command) {
        this.commands[command.name] = command;
    }

    getCommand(name: string): Command | undefined {
        return this.commands[name];
    }

    getAllCommands(): Command[] {
        return Object.values(this.commands);
    }
}

export const commandRegistry = new CommandRegistry();
