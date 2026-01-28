import type { Command } from '../types/Command';
import { banner } from '../utils/banner';
import React from 'react';

const bannerCommand: Command = {
    name: 'banner',
    description: 'Print the system banner',
    execute: () => {
        const content = (
            <div className="whitespace-pre-wrap text-blue-400 font-bold leading-none">
                {banner}
            </div>
        );
        return {
            action: 'print',
            content
        };
    }
};

export default bannerCommand;
