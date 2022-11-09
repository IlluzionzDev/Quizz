/**
 * Main game server handler
 */
import * as player from './player'
import * as packets from '../packet/packets'
import * as WebSocket from 'ws';

// Game object
interface Game {
    host: WebSocket; // Connection of the host
    id: string; // Game ID
    title: string; // Title of game
    questions: packets.QuestionData[]; // All questions
    players: Map<string, player.PlayerData>; // Player's in game
    startTime: number; // Start time in millis
    state: number; // GameState ID
    activeQuestion?: ActiveQuestion; // Current game question
};

// Data for current question in game
interface ActiveQuestion {
    question: packets.QuestionData; // Active question
    index: number; // Index of question in total questions
    marked: boolean; // If question is marked (current question is after this question)
};

// Current game sessions
const games = new Map<string, Game>()

// Get an active game from ID
const getGame = (id: string): Game | undefined => {
    const game: Game | undefined = games.get(id)
    return game
}

export function newGame(host: WebSocket, title: string, questions: packets.QuestionData[]): Game {
    const id = generateGameId(5)
    const players = new Map<string, player.PlayerData>()
    const game: Game = {
        host,
        id,
        title,
        questions,
        players,
        startTime: 0,
        state: packets.GameState.WAITING
    }

    games[id] = game
    return game
}

// Generate a random game ID code
const generateGameId = (length: number) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}