/**
 * Main game server handler
 */
import * as player from './player';
import * as packets from '../packet/packets';
import * as WebSocket from 'ws';

// Object that handles a game
export class Game {
    host: WebSocket; // Connection of the host
    id: string; // Game ID
    title: string; // Title of game
    questions: packets.QuestionData[]; // All questions
    players: Map<string, player.Player>; // Player's in game
    startTime: number; // Start time in millis
    state: number; // GameState ID
    activeQuestion: ActiveQuestion; // Current game question

    constructor(host: WebSocket, id: string, title: string, questions: packets.QuestionData[]) {
        this.host = host;
        this.id = id;
        this.title = title;
        this.questions = questions;

        // Default states
        this.players = new Map<string, player.Player>();
        this.startTime = Date.now();
        this.state = packets.GameState.WAITING;
    }

    // Check if there is a joined player with the same name
    isNameTaken(name: string): boolean {
        for (const [playerId, playerData] of this.players) {
            if (playerData.name.toLowerCase() === name.toLowerCase()) return true;
        }

        return false;
    }

    // Broadcast packets to game
    broadcast(packet: packets.Packet, host: boolean): void {
        this.players.forEach((playerData: player.Player, playerId: string) => {
            packets.sendPacket(playerData.socket, packet);
        });

        // If to send to host server
        if (host) {
            packets.sendPacket(this.host, packet);
        }
    }

    broadcastExcluding(exclude: string, packet: packets.Packet, host: boolean) {
        this.players.forEach((playerData: player.Player, playerId: string) => {
            // If not excluded id
            if (exclude !== playerId) packets.sendPacket(playerData.socket, packet);
        });

        // If to send to host server
        if (host) {
            packets.sendPacket(this.host, packet);
        }
    }

    // Add a player to this game
    addPlayer(client: WebSocket, name: string): player.Player {
        // Create player object
        // Tell player the game state
        // Inform them of their player data
        // Tell all other players in the game that they exist
        return null;
    }

    // Start the game
    start() {}

    // Main game loop for game logic
    gameLoop() {}

    // See if an answer is correct for a current question
    isCorrect(answerIndex: number): boolean {
        return true;
    }

    // If all questions have been answered
    allAnswered(): boolean {
        return true;
    }

    // Calculate score for a player for question
    calculateScore(player: player.Player, question: ActiveQuestion) {}

    // Skip past current question
    skipQuestion() {}

    // Mark a question for all players
    markQuestion(question: ActiveQuestion) {}

    // Change to the next question or end the game
    nextQuestion() {}

    // Set game to game over, show scores etc
    gameOver() {}

    // Set the current game state for all players
    setState(state: packets.GameState) {}

    // Remove player from the game
    removePlayer(player: player.Player) {}

    // Run cleanup code on game
    stop() {}

    // Creates a mostly unique player id
    private generatePlayerId() {
        const id: string = generateRandomId(6);

        if (this.players.has(id)) return id;
        // Retry
        else return this.generatePlayerId();
    }
}

// Data for current question in game
interface ActiveQuestion {
    question: packets.QuestionData; // Active question
    index: number; // Index of question in total questions
    marked: boolean; // If question is marked (current question is after this question)
}

// Current game sessions
const games = new Map<string, Game>();

// Get an active game from ID
export const getGame = (id: string): Game | undefined => {
    const game: Game | undefined = games.get(id);
    return game;
};

export function newGame(host: WebSocket, title: string, questions: packets.QuestionData[]): Game {
    const id = generateRandomId(5);
    const game: Game = new Game(host, id, title, questions);

    games[id] = game;

    // Start game loop

    return game;
}

// Generate a random game ID code
export const generateRandomId = (length: number) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
