import React, { useState } from 'react';
import { User, Swords } from 'lucide-react';
import { Difficulty } from '../hooks/useGameStore';

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
        <div className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-lime-500/20 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-lime-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white text-center">Geometry Dojo</h1>
                    <p className="text-zinc-400 text-center">Enter your name to begin your training.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                            Codename
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            placeholder="Player One"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lime-500 transition-colors"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                            Difficulty
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => setDifficulty(d)}
                                    className={`py-2 px-3 rounded-lg text-sm font-bold capitalize transition-all ${difficulty === d
                                            ? 'bg-lime-500 text-black shadow-lg shadow-lime-500/20'
                                            : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 text-center">
                            {difficulty === 'easy' && "Forgiving (45° Tolerance)"}
                            {difficulty === 'medium' && "Balanced (30° Tolerance)"}
                            {difficulty === 'hard' && "Strict (15° Tolerance)"}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full py-3 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Start Training
                    </button>
                </form>
            </div>
        </div>
    );
};
