import * as WebSocket from 'ws';
import { CPID } from './client';
import { Socket } from 'socket.io';

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

// Defines the type of packet handler function
export type PacketHandlerFunction = (client: WebSocket, data: any) => void;
// Defines the packet handlers map which is id -> handler
export type PacketHandlers = Record<CPID, PacketHandlerFunction>;

// Send a packet to the client
export const sendPacket = (client: Socket, packet: Packet) => {
    client.send(JSON.stringify(packet));
};
