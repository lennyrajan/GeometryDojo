import { useState, useEffect } from 'react';
import { Difficulty, Theme } from '../types';

const STORAGE_KEY = 'geometry-dojo-v1';

interface GameState {
    unlockedLevels: number[];
    scores: Record<number, number>; // levelId -> bestScore
    playerName: string | null;
    theme: Theme;
    difficulty: Difficulty;
}

const defaultState: GameState = {
    unlockedLevels: [1],
    scores: {},
    playerName: null,
    theme: 'dark',
    difficulty: 'medium'
};

export const useGameStore = () => {
    const [state, setState] = useState<GameState>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
        } catch (e) {
            return defaultState;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        // Apply theme to body
        document.body.className = `theme-${state.theme}`;
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

    const setPlayerName = (name: string) => setState(prev => ({ ...prev, playerName: name }));
    const setTheme = (theme: Theme) => setState(prev => ({ ...prev, theme }));
    const setDifficulty = (difficulty: Difficulty) => setState(prev => ({ ...prev, difficulty }));

    const resetProgress = () => setState(prev => ({
        ...prev,
        unlockedLevels: [1],
        scores: {}
    }));

    const clearLeaderboard = () => {
        // Since leaderboard is calculated from scores, 'resetProgress' effectively clears it for the user.
        // But if we want to keep Unlocked Levels but clear Scores?
        // User asked "clear leaderboard".
        setState(prev => ({ ...prev, scores: {} }));
    };

    const factoryReset = () => setState(defaultState);

    return {
        ...state,
        submitScore,
        setPlayerName,
        setTheme,
        setDifficulty,
        resetProgress,
        clearLeaderboard,
        factoryReset
    };
};
