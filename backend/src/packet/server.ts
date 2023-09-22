import { GameState, Packet } from './packets';

// Server packets that are clientbound
export enum SPID {
    SDisconnect = 0x00,
    SError,
    SJoinGame,
    SNameTakenResult,
    SGameState,
    SPlayerData,
    STimeSync,
    SQuestion,
    SAnswerResult,
    SScores
}

// Disconnect a user from the game
export interface SDisconnect {
    reason: string;
}

// Error on the game server
export interface SError {
    cause: string;
}

// Joined a quiz
export interface SJoinGame {
    owner: boolean; // If created this game
    id: string; // Id of the game
    title: string; // Title of quiz
}

// Result of checking if name is taken
export interface SNameTakenResult {
    result: boolean; // If name is taken
}

// Return of current joined game state
export interface SGameState {
    state: number; // ID of game state
}

// Contains data about a player in a game
export interface SPlayerData {
    id: string; // Player id
    name: string; // Player name
    score: number; // Score of player
    type: SPlayerDataType; // Mode for player data
}

export enum SPlayerDataType {
    ADD = 0x00,
    REMOVE,
    SELF
}

// Server time for game to sync up
export interface STimeSync {
    total: number; // Total game time
    remaining: number; // Remaining game time
}

// Current question data
export interface SQuestion {
    question: string; // String question
    answers: string[]; // Available answers
}

// If chosen answer was correct
export interface SAnswerResult {
    result: boolean; // If was correct
}

// Updated scores for the game
// Updated scores for the game
export interface SScores {
    scores: Record<string, number>; // Player scores
}

// Server packet constructors
export const disconnect = (reason: string): Packet => {
    return {
        id: SPID.SDisconnect,
        data: {
            reason
        }
    };
};

export const error = (cause: string): Packet => {
    return {
        id: SPID.SError,
        data: {
            cause
        }
    };
};

export const joinGame = (owner: boolean, id: string, title: string): Packet => {
    return {
        id: SPID.SJoinGame,
        data: {
            owner,
            id,
            title
        }
    };
};

export const nameTakenResult = (result: boolean): Packet => {
    return {
        id: SPID.SNameTakenResult,
        data: {
            result
        }
    };
};

export const gameState = (state: GameState): Packet => {
    return {
        id: SPID.SGameState,
        data: {
            state
        }
    };
};

export const playerData = (id: string, name: string, score: number, type: SPlayerDataType): Packet => {
    return {
        id: SPID.SPlayerData,
        data: {
            id,
            name,
            score,
            type
        }
    };
};

export const timeSync = (total: number, remaining: number): Packet => {
    return {
        id: SPID.STimeSync,
        data: {
            total,
            remaining
        }
    };
};

export const question = (question: string, answers: string[]): Packet => {
    return {
        id: SPID.SQuestion,
        data: {
            question,
            answers
        }
    };
};

export const answerResult = (result: boolean): Packet => {
    return {
        id: SPID.SAnswerResult,
        data: {
            result
        }
    };
};

export const scores = (scores: Record<string, number>): Packet => {
    return {
        id: SPID.SScores,
        data: {
            scores
        }
    };
};
