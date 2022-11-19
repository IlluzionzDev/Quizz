
// Packet data object
export interface Packet {
    id: number;
    data?: Object;
}

// Current state of game
export enum GameState {
    WAITING = 0x00, // Players can join
    ACTIVE, // In session
    FINISHED, // Game over
    NOT_FOUND // Game does not exist
}

// Data for a question
export interface QuestionData {
    question: string; // The question being asked
    answers: string[]; // Answers for this question
    correct: string[]; // All correct answers
}

// Send a packet to the client
export const sendPacket = (client: WebSocket, packet: Packet) => {
    client.send(JSON.stringify(packet));
};
