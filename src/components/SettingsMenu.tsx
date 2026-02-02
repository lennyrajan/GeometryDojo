import React, { useState } from 'react';
import { Settings, X, Trash2, Monitor, Swords, User, Plus, Check, Globe } from 'lucide-react';
import { Difficulty } from '../types';
import { PlayerProfile } from '../hooks/useGameStore';

interface SettingsMenuProps {
    currentDifficulty: Difficulty;
    onSetDifficulty: (diff: Difficulty) => void;
    onClose: () => void;
    onClearLeaderboard: () => void;
    onFactoryReset: () => void;
    players: PlayerProfile[];
    activePlayerId: string;
    onAddPlayer: (name: string) => void;
    onSwitchPlayer: (id: string) => void;
    onDeletePlayer: (id: string) => void;
    theme: 'space' | 'classic';
    toggleTheme: () => void;
    onSyncData?: () => void;
    isSyncing?: boolean;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
    currentDifficulty, onSetDifficulty, onClose, onClearLeaderboard, onFactoryReset,
    players, activePlayerId, onAddPlayer, onSwitchPlayer, onDeletePlayer, theme, toggleTheme,
    onSyncData, isSyncing
}) => {

    const [isAddingUser, setIsAddingUser] = useState(false);
    const [newUserName, setNewUserName] = useState("");

    const confirmAction = (message: string, action: () => void) => {
        if (window.confirm(message)) {
            action();
        }
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUserName.trim().length > 0) {
            onAddPlayer(newUserName.trim());
            setNewUserName("");
            setIsAddingUser(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className={`w-full max-w-sm rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 border text-white max-h-[85vh] flex flex-col ${theme === 'space' ? 'bg-indigo-950 border-indigo-800' : 'bg-zinc-950 border-zinc-800'
                }`}>

                {/* Fixed Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-white" />
                        <h2 className="text-lg font-bold">Settings</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-4 h-4 opacity-70" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900/20">

                    {/* Player Management */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <User className="w-3.5 h-3.5 text-zinc-400" />
                            <h3 className="text-xs font-medium opacity-60 uppercase tracking-wider">Players ({players.length}/4)</h3>
                        </div>

                        <div className="space-y-2">
                            {players.map(p => (
                                <div key={p.id} className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${p.id === activePlayerId ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${p.id === activePlayerId ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'
                                            }`}>
                                            {p.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`text-sm ${p.id === activePlayerId ? 'font-bold' : 'text-zinc-400'}`}>
                                            {p.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {p.id !== activePlayerId && (
                                            <button
                                                onClick={() => onSwitchPlayer(p.id)}
                                                className="px-2 py-1 text-[10px] font-bold bg-white/5 hover:bg-white/10 rounded border border-white/10"
                                            >
                                                SWITCH
                                            </button>
                                        )}
                                        {p.id === activePlayerId && (
                                            <span className="px-2 py-1 text-[10px] font-bold text-green-400 bg-green-400/10 rounded flex items-center gap-1">
                                                <Check className="w-2.5 h-2.5" /> ACTIVE
                                            </span>
                                        )}
                                        {players.length > 1 && (
                                            <button
                                                onClick={() => confirmAction(`Delete player "${p.name}"? This cannot be undone.`, () => onDeletePlayer(p.id))}
                                                className="p-1 px-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isAddingUser ? (
                                <form onSubmit={handleAddUser} className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Player Name"
                                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-white/50"
                                        value={newUserName}
                                        onChange={e => setNewUserName(e.target.value)}
                                        maxLength={10}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newUserName.trim()}
                                        className="p-1.5 bg-white text-black rounded-lg hover:bg-zinc-200 disabled:opacity-50"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingUser(false)}
                                        className="p-1.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </form>
                            ) : (
                                players.length < 4 && (
                                    <button
                                        onClick={() => setIsAddingUser(true)}
                                        className="w-full py-2 border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-lg flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span className="text-xs font-bold uppercase">Add Player</span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                            <h3 className="text-xs font-medium opacity-60 uppercase tracking-wider">Visual Theme</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => theme !== 'space' && toggleTheme()}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'space'
                                    ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-900/50'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'space' ? 'bg-indigo-500' : 'bg-zinc-800'}`}>
                                    <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                                </div>
                                <span className="text-xs font-bold">Space</span>
                            </button>
                            <button
                                onClick={() => theme !== 'classic' && toggleTheme()}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'classic'
                                    ? 'bg-zinc-100 text-black border-white shadow-lg'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'classic' ? 'bg-black text-white' : 'bg-zinc-800'}`}>
                                    <div className="w-4 h-4 border-2 border-current rounded-full" />
                                </div>
                                <span className="text-xs font-bold">Classic</span>
                            </button>
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Swords className="w-3.5 h-3.5 text-zinc-400" />
                            <h3 className="text-xs font-medium opacity-60 uppercase tracking-wider">Difficulty</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => onSetDifficulty(d)}
                                    className={`py-2 px-2 rounded-lg text-xs font-bold capitalize transition-all border ${currentDifficulty === d
                                        ? 'bg-white text-black border-white shadow-lg'
                                        : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] opacity-50 mt-1.5 text-center text-zinc-500">
                            {currentDifficulty === 'easy' && "Forgiving (30° Tolerance)"}
                            {currentDifficulty === 'medium' && "Balanced (15° Tolerance)"}
                            {currentDifficulty === 'hard' && "Strict (8° Tolerance)"}
                        </p>
                    </div>

                    {/* Data Management */}
                    <div>
                        <h3 className="text-xs font-medium opacity-60 mb-2 uppercase tracking-wider">Data Management</h3>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => confirmAction("Are you sure you want to clear your scores for this difficulty?", onClearLeaderboard)}
                                className="flex items-center justify-between w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors group"
                            >
                                <div className="flex items-center gap-2">
                                    <Trash2 className="w-4 h-4 text-zinc-400" />
                                    <span className="font-medium text-sm text-zinc-300">Clear Current Scores</span>
                                </div>
                                <span className="text-[10px] text-zinc-600 group-hover:text-zinc-500">Reset Leaderboard</span>
                            </button>

                            <button
                                onClick={() => confirmAction("WARNING: This will wipe ALL players and data. Cannot be undone.", onFactoryReset)}
                                className="flex items-center justify-between w-full p-3 bg-red-950/20 border border-red-900/30 rounded-lg hover:bg-red-900/40 transition-colors group"
                            >
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-red-500" />
                                    <span className="font-medium text-sm text-red-500">Factory Reset</span>
                                </div>
                                <span className="text-[10px] text-red-500/60 group-hover:text-red-500">Wipe Everything</span>
                            </button>

                            {onSyncData && (
                                <button
                                    onClick={onSyncData}
                                    disabled={isSyncing}
                                    className="flex items-center justify-between w-full p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-lg hover:bg-indigo-900/40 transition-colors group disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-2">
                                        <Globe className={`w-4 h-4 text-indigo-500 ${isSyncing ? 'animate-spin' : ''}`} />
                                        <span className="font-medium text-sm text-indigo-500">{isSyncing ? 'Syncing...' : 'Sync All to World'}</span>
                                    </div>
                                    <span className="text-[10px] text-indigo-500/60 group-hover:text-indigo-500">Push Local Data</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fixed Footer (Credits) */}
                <div className="p-3 border-t border-white/10 text-center shrink-0 bg-zinc-900/50 backdrop-blur rounded-b-2xl">
                    <p className="text-[10px] font-mono opacity-50 text-zinc-500">
                        Made with ☕ by <span className="text-white font-bold">Lenny Rajan</span>
                    </p>
                </div>

            </div>
        </div>
    );
};
