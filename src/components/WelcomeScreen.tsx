import React, { useState } from 'react';
import { Triangle, Square, Circle, ChevronRight } from 'lucide-react';
import { Difficulty } from '../types';

interface WelcomeScreenProps {
    onComplete: (name: string, difficulty: Difficulty) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }
        onComplete(name.trim(), difficulty);
    };

    return (
        <div className="absolute inset-0 z-50 bg-indigo-950 flex flex-col items-center justify-center p-6 transition-colors duration-1000">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Logo / Loading Screen Vibe */}
                <div className="flex flex-col items-center gap-6 mb-12">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/5 rounded-full animate-ping opacity-20" />
                        <div className="w-20 h-20 bg-indigo-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 border border-indigo-400/20 rotate-45 transform transition-transform hover:rotate-90 duration-500">
                            <div className="-rotate-45 flex items-center justify-center -space-x-4">
                                <Triangle className="w-8 h-8 text-indigo-400 fill-indigo-400/20" />
                                <Circle className="w-8 h-8 text-purple-400 fill-purple-400/20" />
                                <Square className="w-8 h-8 text-pink-400 fill-pink-400/20" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
                            GEOMETRY <span className="text-indigo-400">DOJO</span>
                        </h1>
                        <p className="text-indigo-200/60 font-mono text-xs tracking-[0.2em] uppercase">
                            Precision Training Module
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-indigo-200/50 uppercase tracking-widest ml-1">
                                Agent Identity
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError('');
                                }}
                                placeholder="Enter Codename..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:bg-black/40 focus:border-indigo-500/50 transition-all font-medium text-lg"
                                autoFocus
                            />
                            {error && <p className="text-red-400 text-xs ml-1 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                                {error}
                            </p>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-indigo-200/50 uppercase tracking-widest ml-1">
                                Calibration Level
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setDifficulty(d)}
                                        className={`group relative py-3 px-2 rounded-xl text-xs font-bold capitalize transition-all overflow-hidden ${difficulty === d
                                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20'
                                            : 'bg-white/5 text-indigo-200/50 hover:bg-white/10 hover:text-indigo-200'
                                            }`}
                                    >
                                        <span className="relative z-10">{d}</span>
                                        {difficulty === d && (
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-center font-mono text-indigo-300/40">
                                {difficulty === 'easy' && "TOLERANCE: 30° // STATUS: FORGIVING"}
                                {difficulty === 'medium' && "TOLERANCE: 15° // STATUS: BALANCED"}
                                {difficulty === 'hard' && "TOLERANCE: 8° // STATUS: PRECISE"}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="w-full group relative py-4 bg-white text-indigo-950 text-sm font-black uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Initialize
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
