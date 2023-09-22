import { QuestionData } from './packets';

// Client packets that are serverbound
export enum CPID {
    CCreateGame = 0x00,
    CCheckNameTaken,
    CRequestGameState,
    CRequestJoin,
    CStateChange,
    CAnswer,
    CKick
}

// Request to create a quiz
export interface CCreateGame {
    title: string;
    questions: QuestionData[];
}

// Request to see if name is taken
export interface CCheckNameTaken {
    id: string;
    name: string;
}

// Request active game state
export interface CRequestGameState {
    id: string;
}

// Request to join with a name
export interface CRequestJoin {
    id: string;
    name: string;
}

// Request to change client state
export interface CStateChange {
    state: number; // Game state
}

export enum CStateChangeState {
    DISCONNECT = 0x00, // Disconnect from the game
    START, // Start the current game
    SKIP // Skip the current question
}

// Request to set answer for a question
export interface CAnswer {
    id: number;
}

// Request kick of a player
export interface CKick {
    id: string;
}
