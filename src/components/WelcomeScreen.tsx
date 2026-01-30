import React, { useState } from 'react';
import { User } from 'lucide-react';

interface WelcomeScreenProps {
    onComplete: (name: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }
        onComplete(name.trim());
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
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

                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full py-3 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Start Game
                    </button>
                </form>
            </div>
        </div>
    );
};
