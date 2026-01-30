import React from 'react';
import { Settings, X, Trash2, Monitor, Swords } from 'lucide-react';
import { Theme, Difficulty } from '../types';

interface SettingsMenuProps {
    currentTheme: Theme;
    onSetTheme: (theme: Theme) => void;
    currentDifficulty: Difficulty;
    onSetDifficulty: (diff: Difficulty) => void;
    onClose: () => void;
    onClearLeaderboard: () => void;
    onFactoryReset: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
    currentTheme, onSetTheme, currentDifficulty, onSetDifficulty, onClose, onClearLeaderboard, onFactoryReset
}) => {

    const themes: { id: Theme, name: string, color: string }[] = [
        { id: 'dark', name: 'Dark Mode', color: 'bg-zinc-900 border-zinc-700' },
        { id: 'light', name: 'Light Mode', color: 'bg-white border-gray-200 text-black' },
        { id: 'colorful', name: 'Colorful', color: 'bg-gradient-to-br from-purple-500 to-pink-500 border-white/20' },
        { id: 'retro', name: 'Retro', color: 'bg-amber-100 border-amber-900 text-amber-900' },
    ];

    const confirmAction = (message: string, action: () => void) => {
        if (window.confirm(message)) {
            action();
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 bg-zinc-900 border border-zinc-800 text-white max-h-[90vh] overflow-y-auto`}>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Settings className="w-6 h-6 text-lime-400" />
                        <h2 className="text-xl font-bold">Settings</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 opacity-70" />
                    </button>
                </div>

                {/* Difficulty */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Swords className="w-4 h-4 text-zinc-400" />
                        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Difficulty</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                            <button
                                key={d}
                                onClick={() => onSetDifficulty(d)}
                                className={`py-3 px-3 rounded-xl text-sm font-bold capitalize transition-all border ${currentDifficulty === d
                                    ? 'bg-lime-500 text-black border-lime-500 shadow-lg shadow-lime-500/20'
                                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-zinc-500 mt-2 text-center">
                        {currentDifficulty === 'easy' && "Forgiving (45° Tolerance)"}
                        {currentDifficulty === 'medium' && "Balanced (30° Tolerance)"}
                        {currentDifficulty === 'hard' && "Strict (15° Tolerance)"}
                    </p>
                </div>

                {/* Themes */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Appearance</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {themes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => onSetTheme(t.id)}
                                className={`p-4 rounded-xl border-2 flex items-center justify-center transition-all ${currentTheme === t.id
                                    ? 'border-lime-500 ring-2 ring-lime-500/20'
                                    : 'border-transparent hover:border-zinc-700'
                                    } ${t.color}`}
                            >
                                <span className="font-semibold">{t.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data Management */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Data Management</h3>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => confirmAction("Are you sure you want to clear the leaderboard? Your progress will remain.", onClearLeaderboard)}
                            className="flex items-center justify-between w-full p-4 bg-zinc-950 rounded-xl hover:bg-zinc-800 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <Trash2 className="w-5 h-5 text-red-400" />
                                <span className="font-medium text-zinc-200">Clear Leaderboard</span>
                            </div>
                            <span className="text-xs text-zinc-600 group-hover:text-zinc-500">Reset Scores</span>
                        </button>

                        <button
                            onClick={() => confirmAction("WARNING: This will wipe EVERYTHING including your name, scores, and unlocked levels. Cannot be undone.", onFactoryReset)}
                            className="flex items-center justify-between w-full p-4 bg-zinc-950 rounded-xl hover:bg-red-950/30 transition-colors group border border-transparent hover:border-red-900/50"
                        >
                            <div className="flex items-center gap-3">
                                <Monitor className="w-5 h-5 text-red-500" />
                                <span className="font-medium text-red-400">Factory Reset</span>
                            </div>
                            <span className="text-xs text-red-900/60 group-hover:text-red-500/60">Wipe All Data</span>
                        </button>
                    </div>
                </div>

                {/* Credits */}
                <div className="text-center pt-4 border-t border-zinc-800/50">
                    <p className="text-zinc-500 text-sm font-mono">
                        Made with ☕ by <span className="text-lime-500 font-bold">Lenny Rajan</span>
                    </p>
                </div>

            </div>
        </div>
    );
};
