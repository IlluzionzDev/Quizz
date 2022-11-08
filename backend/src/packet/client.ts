const clientIds = {
    CCreateGame: 0x01,
    CCheckNameTaken: 0x02,
    CRequestGameState: 0x03,
    CRequestJoin: 0x04,
    CStateChange: 0x05,
    CAnswer: 0x06,
    CKick: 0x07
};

// Request to create a quiz
type CCreateGame = {
    title: string;
    questions: QuestionData[];
};

// Request to see if name is taken
type CCheckNameTaken = {
    id: string;
    name: string;
};

// Request active game state
type CRequestGameState = {
    id: string;
};

// Request to join with a name
type CRequestJoin = {
    id: string;
    name: string;
};

// Request to change state
type CStateChange = {
    state: number;
};

// Request to set answer for a question
type CAnswer = {
    id: number;
};

// Request kick of a player
type CKick = {
    id: string;
};

export { clientIds, CCreateGame, CCheckNameTaken, CRequestGameState, CRequestJoin, CStateChange, CAnswer, CKick };
