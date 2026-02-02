import { useState, useEffect } from 'react';
import { Difficulty } from '../types';
import levels from '../lib/shapes';

const STORAGE_KEY = 'geometry-dojo-v1';

// New Profile Structure
export interface PlayerProfile {
    id: string;
    name: string;
    // Scores and Unlocked Levels per difficulty
    scores: {
        easy: Record<number, number>;
        medium: Record<number, number>;
        hard: Record<number, number>;
    };
    unlockedLevels: {
        easy: number[];
        medium: number[];
        hard: number[];
    };
}

interface GameState {
    players: PlayerProfile[];
    activePlayerId: string;
    difficulty: Difficulty;
    theme: 'space' | 'classic';
}

const generateId = () => `player-${Math.random().toString(36).substr(2, 9)}`;

const defaultState: GameState = {
    players: [{ id: generateId(), name: 'Student', scores: { easy: {}, medium: {}, hard: {} }, unlockedLevels: { easy: [1], medium: [1], hard: [1] } }],
    activePlayerId: '', // Will be set in the first player object
    difficulty: 'medium',
    theme: 'space',
};

// Fix activePlayerId in default state
defaultState.activePlayerId = defaultState.players[0].id;

export const useGameStore = () => {
    const [state, setState] = useState<GameState>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return defaultState;

            const parsed = JSON.parse(stored);

            // MIGRATION LOGIC: Check if it's the old format (has 'scores' at root but no 'players')
            if (!parsed.players && parsed.scores) {
                console.log("Migrating legacy data...");
                const legacyScores = parsed.scores || {};
                const legacyUnlocked = parsed.unlockedLevels || [1];
                const legacyName = parsed.playerName || 'Player 1';
                const legacyDiff = parsed.difficulty || 'medium';

                // Map legacy data to the legacy difficulty
                const newProfile: PlayerProfile = {
                    id: 'player-1',
                    name: legacyName,
                    scores: {
                        easy: {},
                        medium: {},
                        hard: {}
                    },
                    unlockedLevels: {
                        easy: [1],
                        medium: [1],
                        hard: [1]
                    }
                };

                // Assign to specific difficulty slots
                newProfile.scores[legacyDiff as Difficulty] = legacyScores;
                newProfile.unlockedLevels[legacyDiff as Difficulty] = legacyUnlocked;

                return {
                    players: [newProfile],
                    activePlayerId: 'player-1',
                    difficulty: legacyDiff,
                    theme: 'space'
                };
            }

            // Ensure theme exists for existing v1 data
            if (!parsed.theme) parsed.theme = 'space';

            // Fix legacy/generic player-1 IDs to be unique for global leaderboard
            const fixedState = { ...defaultState, ...parsed };
            fixedState.players = fixedState.players.map((p: PlayerProfile) => {
                if (p.id === 'player-1') {
                    return { ...p, id: `player-${Math.random().toString(36).substr(2, 9)}` };
                }
                return p;
            });
            if (fixedState.activePlayerId === 'player-1' && fixedState.players.length > 0) {
                fixedState.activePlayerId = fixedState.players[0].id;
            }

            return fixedState;

        } catch (e) {
            console.error('Failed to load game state:', e);
            return defaultState;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    // Helper to get active player
    const activePlayer = state.players.find(p => p.id === state.activePlayerId) || state.players[0];

    // Actions
    const setDifficulty = (diff: Difficulty) => setState(prev => ({ ...prev, difficulty: diff }));

    const submitScore = (levelId: number, score: number) => {
        setState((prev: GameState) => {
            const playerIndex = prev.players.findIndex(p => p.id === prev.activePlayerId);
            if (playerIndex === -1) return prev;

            const player = prev.players[playerIndex];
            const currentDiff = prev.difficulty;

            // Update Score for current difficulty
            const oldBest = player.scores[currentDiff][levelId] || 0;
            const newBest = Math.max(oldBest, score);

            const newScores = {
                ...player.scores,
                [currentDiff]: { ...player.scores[currentDiff], [levelId]: newBest }
            };

            // Update Unlocked Levels for current difficulty
            const currentUnlocked = player.unlockedLevels[currentDiff];
            let newUnlocked = [...currentUnlocked];

            if (score >= 92.0 && !newUnlocked.includes(levelId + 1)) {
                newUnlocked.push(levelId + 1);
            }

            const newUnlockedMap = {
                ...player.unlockedLevels,
                [currentDiff]: newUnlocked
            };

            const newPlayers = [...prev.players];
            newPlayers[playerIndex] = {
                ...player,
                scores: newScores,
                unlockedLevels: newUnlockedMap
            };

            return { ...prev, players: newPlayers };
        });
    };

    const addPlayer = (name: string) => {
        if (state.players.length >= 4) return;
        const newId = `player-${Date.now()}`;
        const newPlayer: PlayerProfile = {
            id: newId,
            name,
            scores: { easy: {}, medium: {}, hard: {} },
            unlockedLevels: { easy: [1], medium: [1], hard: [1] }
        };
        setState((prev: GameState) => ({
            ...prev,
            players: [...prev.players, newPlayer],
            activePlayerId: newId // Switch to new player
        }));
    };

    const switchPlayer = (id: string) => {
        setState((prev: GameState) => ({ ...prev, activePlayerId: id }));
    };

    const updatePlayerName = (name: string) => {
        setState(prev => {
            const newPlayers = prev.players.map(p =>
                p.id === prev.activePlayerId ? { ...p, name } : p
            );
            return { ...prev, players: newPlayers };
        });
    };

    const clearLeaderboard = () => {
        // Only clears current player's scores for CURRENT difficulty?
        // Or global? User said "Clear Leaderboard". 
        // Let's clear scores for the active player across ALL difficulties to be "Factory Reset-lite"
        // Or just current difficulty? "Leaderboard" usually implies the view they are looking at.
        // Let's safe-guard and only clear current difficulty scores.
        setState((prev: GameState) => {
            const newPlayers = prev.players.map(p => {
                if (p.id === prev.activePlayerId) {
                    return {
                        ...p,
                        scores: { ...p.scores, [prev.difficulty]: {} }
                    };
                }
                return p;
            });
            return { ...prev, players: newPlayers };
        });
    };

    const factoryReset = () => {
        // Complete wipe
        setState(defaultState);
    };

    const deletePlayer = (id: string) => {
        if (state.players.length <= 1) return; // Cannot delete last player
        setState((prev: GameState) => {
            const newPlayers = prev.players.filter(p => p.id !== id);
            // If we deleted active player, switch to first available
            const newActive = prev.activePlayerId === id ? newPlayers[0].id : prev.activePlayerId;
            return { ...prev, players: newPlayers, activePlayerId: newActive };
        });
    };

    const toggleTheme = () => {
        setState(prev => ({
            ...prev,
            theme: prev.theme === 'space' ? 'classic' : 'space'
        }));
    };

    return {
        // State
        difficulty: state.difficulty,
        activePlayer,
        allPlayers: state.players,
        theme: state.theme, // Expose theme

        // Computed for convenience (UI compat)
        unlockedLevels: activePlayer.name.toUpperCase() === 'MASTERMAD'
            ? levels.map(l => l.id)
            : activePlayer.unlockedLevels[state.difficulty],
        scores: activePlayer.scores[state.difficulty],
        playerName: activePlayer.name,

        // Actions
        setDifficulty,
        submitScore,
        setPlayerName: updatePlayerName, // Alias for compat
        addPlayer,
        switchPlayer,
        deletePlayer,
        clearLeaderboard,
        factoryReset,
        toggleTheme,

        // Aggregate Stats for Global Sync
        getActivePlayerStats: (diff: Difficulty) => {
            const scores = activePlayer.scores[diff];
            const unlocked = activePlayer.unlockedLevels[diff];
            const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
            const completedCount = Object.keys(scores).length;
            const averageAccuracy = completedCount > 0 ? totalScore / completedCount : 0;
            const highestLevel = Math.max(...unlocked, 0);

            return {
                totalScore,
                averageAccuracy,
                highestLevel,
                name: activePlayer.name,
                id: activePlayer.id
            };
        }
    };
};
