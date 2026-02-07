import { useState } from 'react';
import Terminal from './components/Terminal';
import BootSequence from './components/BootSequence';

function App() {
    const [isBooting, setIsBooting] = useState(true);

    return (
        <div className="min-h-screen bg-terminal-bg text-terminal-text font-mono selection:bg-terminal-text selection:text-terminal-bg">
            {isBooting ? (
                <div className="h-screen w-full">
                    <BootSequence onComplete={() => setIsBooting(false)} />
                </div>
            ) : (
                <div className="h-screen w-full">
                    <Terminal />
                </div>
            )}
        </div>
    )
}

export default App
