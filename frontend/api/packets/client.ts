import { QuestionData } from './packets';
// Client packet data

// Client packet ids
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

export const createGame = (title: string, questions: QuestionData[]) => {
    return {
        id: CPID.CCreateGame,
        data: {
            title,
            questions
        }
    };
};

export const checkNameTaken = (id: string, name: string) => {
    return {
        id: CPID.CCheckNameTaken,
        data: {
            id,
            name
        }
    };
};

export const requestGameState = (id: string) => {
    return {
        id: CPID.CRequestGameState,
        data: {
            id
        }
    };
};

export const requestJoin = (id: string, name: string) => {
    return {
        id: CPID.CRequestJoin,
        data: {
            id,
            name
        }
    };
};

export const stateChange = (state: CStateChangeState) => {
    return {
        id: CPID.CStateChange,
        data: {
            state
        }
    };
};

export const answer = (id: number) => {
    return {
        id: CPID.CAnswer,
        data: {
            id
        }
    };
};

export const kickPlayer = (id: string) => {
    return {
        id: CPID.CKick,
        data: {
            id
        }
    };
};
