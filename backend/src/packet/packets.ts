import * as WebSocket from 'ws';

// Packet data object
export interface Packet {
    id: number;
    data?: Object;
}

// Current state of game
export enum GameState {
    WAITING = 0x00, // Players can join
    STARTING, // Currently counting down to start
    ACTIVE, // In session
    FINISHED, // Game over
    NOT_FOUND, // Game does not exist
    UNSET
}

// Data for a question
export interface QuestionData {
    question: string; // The question being asked
    answers: string[]; // Answers for this question
    correct: number[]; // All correct answers indexes
}

// Send a packet to the client
export const sendPacket = (client: WebSocket, packet: Packet) => {
    client.send(JSON.stringify(packet));
};
