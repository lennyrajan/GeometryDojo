import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
            <p className="mt-4 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] animate-pulse">
                Entering Dojo...
            </p>
        </div>
    );
};
