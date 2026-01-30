import React, { useState } from 'react';
import { Settings, X, Trash2, Monitor, Swords, User, Plus, Check, LogOut } from 'lucide-react';
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
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
    currentDifficulty, onSetDifficulty, onClose, onClearLeaderboard, onFactoryReset,
    players, activePlayerId, onAddPlayer, onSwitchPlayer, onDeletePlayer
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
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 bg-zinc-950 border border-zinc-800 text-white max-h-[90vh] flex flex-col`}>

                {/* Fixed Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Settings className="w-6 h-6 text-white" />
                        <h2 className="text-xl font-bold">Settings</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 opacity-70" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Player Management */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-4 h-4 text-zinc-400" />
                            <h3 className="text-sm font-medium opacity-60 uppercase tracking-wider">Players ({players.length}/4)</h3>
                        </div>

                        <div className="space-y-3">
                            {players.map(p => (
                                <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${p.id === activePlayerId ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${p.id === activePlayerId ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'
                                            }`}>
                                            {p.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={p.id === activePlayerId ? 'font-bold' : 'text-zinc-400'}>
                                            {p.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {p.id !== activePlayerId && (
                                            <button
                                                onClick={() => onSwitchPlayer(p.id)}
                                                className="px-3 py-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
                                            >
                                                SWITCH
                                            </button>
                                        )}
                                        {p.id === activePlayerId && (
                                            <span className="px-3 py-1.5 text-xs font-bold text-green-400 bg-green-400/10 rounded-lg flex items-center gap-1">
                                                <Check className="w-3 h-3" /> ACTIVE
                                            </span>
                                        )}
                                        {players.length > 1 && (
                                            <button
                                                onClick={() => confirmAction(`Delete player "${p.name}"? This cannot be undone.`, () => onDeletePlayer(p.id))}
                                                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
                                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-white/50"
                                        value={newUserName}
                                        onChange={e => setNewUserName(e.target.value)}
                                        maxLength={12}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newUserName.trim()}
                                        className="p-2 bg-white text-black rounded-xl hover:bg-zinc-200 disabled:opacity-50"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingUser(false)}
                                        className="p-2 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </form>
                            ) : (
                                players.length < 4 && (
                                    <button
                                        onClick={() => setIsAddingUser(true)}
                                        className="w-full py-3 border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="text-sm font-bold uppercase">Add Player</span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Swords className="w-4 h-4 text-zinc-400" />
                            <h3 className="text-sm font-medium opacity-60 uppercase tracking-wider">Difficulty</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => onSetDifficulty(d)}
                                    className={`py-3 px-3 rounded-xl text-sm font-bold capitalize transition-all border ${currentDifficulty === d
                                        ? 'bg-white text-black border-white shadow-lg'
                                        : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs opacity-50 mt-2 text-center text-zinc-500">
                            {currentDifficulty === 'easy' && "Forgiving (45° Tolerance)"}
                            {currentDifficulty === 'medium' && "Balanced (30° Tolerance)"}
                            {currentDifficulty === 'hard' && "Strict (15° Tolerance)"}
                        </p>
                    </div>

                    {/* Data Management */}
                    <div>
                        <h3 className="text-sm font-medium opacity-60 mb-4 uppercase tracking-wider">Data Management</h3>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => confirmAction("Are you sure you want to clear your scores for this difficulty?", onClearLeaderboard)}
                                className="flex items-center justify-between w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Trash2 className="w-5 h-5 text-zinc-400" />
                                    <span className="font-medium text-zinc-300">Clear Current Scores</span>
                                </div>
                                <span className="text-xs text-zinc-600 group-hover:text-zinc-500">Reset Leaderboard</span>
                            </button>

                            <button
                                onClick={() => confirmAction("WARNING: This will wipe ALL players and data. Cannot be undone.", onFactoryReset)}
                                className="flex items-center justify-between w-full p-4 bg-red-950/20 border border-red-900/30 rounded-xl hover:bg-red-900/40 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Monitor className="w-5 h-5 text-red-500" />
                                    <span className="font-medium text-red-500">Factory Reset</span>
                                </div>
                                <span className="text-xs text-red-500/60 group-hover:text-red-500">Wipe Everything</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer (Credits) */}
                <div className="p-4 border-t border-white/10 text-center shrink-0 bg-zinc-900/50 backdrop-blur rounded-b-2xl">
                    <p className="text-sm font-mono opacity-50 text-zinc-500">
                        Made with ☕ by <span className="text-white font-bold">Lenny Rajan</span>
                    </p>
                </div>

            </div>
        </div>
    );
};
