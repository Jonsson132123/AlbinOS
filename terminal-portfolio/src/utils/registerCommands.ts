import { commandRegistry } from './commandRegistry';
import helpCommand from '../commands/help';
import clearCommand from '../commands/clear';
import whoamiCommand from '../commands/whoami';
import pwdCommand from '../commands/pwd';
import lsCommand from '../commands/ls';
import cdCommand from '../commands/cd';
import catCommand from '../commands/cat';
import bannerCommand from '../commands/banner';
import { ssh } from '../commands/ssh';
import exitCommand from '../commands/exit';
import touchCommand from '../commands/touch';

export const registerAllCommands = () => {
    commandRegistry.register(helpCommand);
    commandRegistry.register(clearCommand);
    commandRegistry.register(whoamiCommand);
    commandRegistry.register(pwdCommand);
    commandRegistry.register(lsCommand);
    commandRegistry.register(cdCommand);
    commandRegistry.register(catCommand);
    commandRegistry.register(bannerCommand);
    commandRegistry.register(ssh);
    commandRegistry.register(exitCommand);
    commandRegistry.register(touchCommand);
    // Future commands will be added here
};
