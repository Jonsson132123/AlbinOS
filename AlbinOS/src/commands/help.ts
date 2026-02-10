import type { Command } from '../types/Command';

const helpCommand: Command = {
    name: 'help',
    description: 'List available commands',
    execute: () => {
        const helpText = `
Available Commands:

help   - List available commands
clear  - Clear the terminal output
whoami - Display user information
pwd    - Print working directory
ls     - List directory contents
         Flags: -l (long format),  -R (recursive)
cd     - Change directory
cat    - Concatenate files to standard output
banner - Display the banner
ssh    - Connect to a remote server
exit   - Close the ssh session
touch  - Create an empty file
nano   - Edit a file
john   - John the Ripper password cracker
rm     - Remove files or directories
         Flags: -r (recursive),  -F (force)
su     - Switch user
        `;
        return {
            action: 'print',
            content: helpText.trim()
        };
    }
};

export default helpCommand;
