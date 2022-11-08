// Server packet ids
const serverIds = {
    SDisconnect: 0x00,
    SError: 0x01,
    SJoinedGame: 0x02,
    SNameTakenResult: 0x03,
    SGameState: 0x04,
    SPlayerData: 0x05,
    STimeSync: 0x06,
    SQuestion: 0x07,
    SAnswerResult: 0x08,
    SScores: 0x09
};

// Disconnect a user from the game
type SDisconnect = {
    reason: string;
};

// Error on the game server
type SError = {
    cause: string;
};

// Joined a quiz
type SJoinedGame = {
    owner: boolean; // If created this game
    id: string; // Id of the game
    title: string; // Name of user
};

// Result of checking if name is taken
type SNameTakenResult = {
    result: boolean; // If name is taken
};

// Return of current joined game state
type SGameState = {
    state: number; // ID of game state
};

// The player's current data
type SPlayerData = {
    id: string; // Player id
    name: string; // Player name
    type: number;
};

// Server time for game to sync up
type STimeSync = {
    total: number; // Total game time
    remaining: number; // Remaining game time
};

// Current question data
type SQuestion = {
    question: string; // String question
    answers: string[]; // Available answers
};

// If chosen answer was correct
type SAnswerResult = {
    result: boolean; // If was correct
};

// Updated scores for the game
type SScores = {
    scores: Map<number, string>; // Player scores
};

export { serverIds, SDisconnect, SError, SJoinedGame, SNameTakenResult, SGameState, SPlayerData, STimeSync, SQuestion, SAnswerResult, SScores };
