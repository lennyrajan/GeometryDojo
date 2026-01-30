import { useState, useEffect } from 'react';

const STORAGE_KEY = 'geometry-dojo-v1';

interface GameState {
    unlockedLevels: number[];
    scores: Record<number, number>; // levelId -> bestScore
}

const defaultState: GameState = {
    unlockedLevels: [1],
    scores: {}
};

export const useGameStore = () => {
    const [state, setState] = useState<GameState>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : defaultState;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const submitScore = (levelId: number, score: number) => {
        setState(prev => {
            const best = Math.max(prev.scores[levelId] || 0, score);
            const newScores = { ...prev.scores, [levelId]: best };

            const newUnlocked = [...prev.unlockedLevels];
            if (score >= 92.0) {
                // Unlock next level
                if (!newUnlocked.includes(levelId + 1)) {
                    newUnlocked.push(levelId + 1);
                }
            }

            return {
                ...prev,
                scores: newScores,
                unlockedLevels: newUnlocked
            };
        });
    };

    return {
        unlockedLevels: state.unlockedLevels,
        scores: state.scores,
        submitScore,
        resetProgress: () => setState(defaultState)
    };
};
