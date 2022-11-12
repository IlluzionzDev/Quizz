import * as WebSocket from 'ws';
import { Game } from './server';

// A player instance is created when joining a game instance
export class Player {
    socket: WebSocket; // Client connection
    id: string; // Player id
    name: string; // Name of player in game
    score: number; // Aquired score
    answers: Map<number, number>; // Selected answers
    answerTime: number; // Amount of millis took to answer question

    constructor(socket: WebSocket, id: string, name: string) {
        this.socket = socket;
        this.id = id;
        this.name = name;

        // Default variables
        this.score = 0;
        this.answers = new Map<number, number>();
        this.answerTime = 0;
    }

    // Get the selected answer for a question
    // Returns -1 if not yet selected
    getAnswer(questionIndex: number): number {
        if (!this.answers.has(questionIndex)) return -1;

        return this.answers.get(questionIndex) ?? -1;
    }

    // Check if player has answered the question for the current game
    hasAnswered(game: Game): boolean {
        const activeQuestion = game.activeQuestion;
        return this.getAnswer(activeQuestion.index) !== -1;
    }

    // Answer the current game question
    answer(game: Game, questionIndex: number) {}
}
