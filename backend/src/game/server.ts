/**
 * Main game server handler
 */
import * as packets from '../packet/packets';
import * as WebSocket from 'ws';
import { Player } from './player';
import { answerResult, disconnect, gameState, playerData, question, scores, SPlayerDataType, timeSync } from '../packet/server';

// Question timers, TOOD: Refactor to each question etc
const START_DELAY = 5 * 1000;
const QUESTION_TIME = 20 * 1000;
const SYNC_DELAY = 3 * 1000;
const MARK_TIME = 3 * 1000;
const BONUS_TIME = 5 * 1000;

// Object that handles a game
export class Game {
    host: WebSocket; // Connection of the host
    id: string; // Game ID
    title: string; // Title of game
    questions: packets.QuestionData[]; // All questions
    players: Map<string, Player>; // Player's in game
    startTime: number; // Start time in millis
    state: packets.GameState; // GameState ID
    activeQuestion: ActiveQuestion; // Current game question

    constructor(host: WebSocket, id: string, title: string, questions: packets.QuestionData[]) {
        this.host = host;
        this.id = id;
        this.title = title;
        this.questions = questions;

        // Default states
        this.players = new Map<string, Player>();
        this.startTime = Date.now();
        this.state = packets.GameState.WAITING;
    }

    // Check if there is a joined player with the same name
    isNameTaken(name: string): boolean {
        for (const [_, playerData] of this.players) {
            if (playerData.name.toLowerCase() === name.toLowerCase()) return true;
        }

        return false;
    }

    // Broadcast packets to game
    broadcast(packet: packets.Packet, host: boolean): void {
        this.players.forEach((playerData: Player, playerId: string) => {
            packets.sendPacket(playerData.socket, packet);
        });

        // If to send to host server
        if (host) {
            packets.sendPacket(this.host, packet);
        }
    }

    broadcastExcluding(exclude: string, packet: packets.Packet, host: boolean) {
        this.players.forEach((playerData: Player, playerId: string) => {
            // If not excluded id
            if (exclude !== playerId) packets.sendPacket(playerData.socket, packet);
        });

        // If to send to host server
        if (host) {
            packets.sendPacket(this.host, packet);
        }
    }

    // Add a player to this game
    addPlayer(client: WebSocket, name: string): Player {
        // Create player object
        const playerId = this.generatePlayerId();
        const player: Player = new Player(client, playerId, name);

        // Inform player of all other player data
        this.players.forEach((foundPlayer, id) => {
            packets.sendPacket(player.socket, playerData(id, foundPlayer.name, 0, SPlayerDataType.ADD));
        });

        // Add player to game
        this.players.set(playerId, player);

        // Tell player the game state
        packets.sendPacket(player.socket, gameState(packets.GameState.WAITING));

        // Inform them of their player data
        packets.sendPacket(player.socket, playerData(playerId, player.name, player.score, SPlayerDataType.SELF));

        // Tell all other players in the game that they exist
        this.broadcastExcluding(playerId, playerData(playerId, player.name, player.score, SPlayerDataType.ADD), true);

        return player;
    }

    // Start the game
    start() {
        console.log(`Starting game with id ${this.id}`);
        this.setState(packets.GameState.STARTING);
        this.startTime = Date.now();
    }

    // Main game loop for game logic
    gameLoop() {
        let lastTimeSync = 0;

        // Run logic every second
        const worker = setInterval(() => {
            // Snapshot game state for this loop
            const gameState = this.state;

            // Finish loop if game over
            if (gameState === packets.GameState.FINISHED) clearInterval(worker);

            const currentTime = Date.now();
            // Millis before last time sync
            let elapsedTimeSync = currentTime - lastTimeSync;

            // Start countdown timer
            if (gameState === packets.GameState.STARTING) {
                // If we should ensure everyones time is actually the same
                if (elapsedTimeSync >= SYNC_DELAY) {
                    lastTimeSync = currentTime;
                    // Amount of time since game started
                    const elapsedSinceStart = currentTime - this.startTime;

                    // If total time elapsed, start game
                    if (elapsedSinceStart >= START_DELAY) {
                        this.setState(packets.GameState.ACTIVE);
                    } else {
                        const remaining = START_DELAY - elapsedSinceStart;
                        this.broadcast(timeSync(START_DELAY, remaining), true);
                    }
                }
            }

            // Loop question timers and mark questions
            if (gameState === packets.GameState.ACTIVE) {
                // Just starting, ask first question
                if (this.activeQuestion == null) {
                    this.nextQuestion();
                    lastTimeSync = -1;
                } else {
                    // Amount of time since question started
                    const elapsedSinceStart = currentTime - this.activeQuestion.startTime;

                    // Amount of time after question as marked
                    const elapsedSinceMark = currentTime - this.activeQuestion.markTime;

                    // Asking time has passed or question skipped
                    if (elapsedSinceStart >= QUESTION_TIME || this.activeQuestion.skiped) {
                        // Marking question
                        if (!this.activeQuestion.marked) {
                            // Mark if not marked
                            this.markQuestion(this.activeQuestion);
                        } else if (elapsedSinceMark >= MARK_TIME) {
                            this.nextQuestion();
                            lastTimeSync = -1;
                        }
                    } else {
                        // See if everyone has answered anyway so skip question
                        if (this.allAnswered()) {
                            this.skipQuestion();
                        }

                        // Ensure countdown timer is synced up
                        if (elapsedTimeSync >= SYNC_DELAY) {
                            lastTimeSync = currentTime;
                            const remaining = QUESTION_TIME - elapsedSinceStart;
                            this.broadcast(timeSync(QUESTION_TIME, remaining), true);
                        }
                    }
                }
            }
        }, 1000);
    }

    // If all questions have been answered
    allAnswered(): boolean {
        let notAnswered = false;

        for (const [_, player] of this.players) {
            if (!player.hasAnswered(this)) notAnswered = true;
        }

        return !notAnswered;
    }

    // Calculate score for a player for question
    calculateScore(player: Player, question: ActiveQuestion) {
        // Millis took to answer question
        const timePassed = player.answerTime - question.startTime;

        // TODO: Refactor into question settings
        const BASE_POINTS = 100;
        const BONUS_POINTS = 200;

        // If answered within bonus time
        if (timePassed <= BONUS_TIME) {
            const percent = Math.max(1 - timePassed / BONUS_TIME, 0);
            const bonus = Math.round(percent * BONUS_POINTS);
            return BASE_POINTS + bonus;
        } else {
            return BASE_POINTS;
        }
    }

    // Skip past current question
    skipQuestion() {
        if (this.activeQuestion != null) {
            // Mark question as skiped
            this.activeQuestion.skiped = true;
        } else {
            // Ensure we have question
            this.nextQuestion();
        }
    }

    // Mark a question for all players
    markQuestion(question: ActiveQuestion) {
        this.players.forEach((player) => {
            // Answered index, -1 if not answered
            const answerIndex = player.getAnswer(this.activeQuestion.index);

            // If correct
            const correct = answerIndex !== -1 && question.isCorrect(answerIndex);

            // Send result
            packets.sendPacket(player.socket, answerResult(correct));

            // Update score
            if (correct) {
                const score = this.calculateScore(player, question);
                player.score += score;
            }
        });

        // Broadcast updated scores to players
        const playerScores: Record<string, number> = {};
        this.players.forEach((player) => {
            playerScores[player.id] = player.score;
        });
        this.broadcast(scores(playerScores), true);

        // Flag as marked
        question.marked = true;
        question.markTime = Date.now();
    }

    // Change to the next question or end the game
    nextQuestion() {
        const currentTime = Date.now();

        // Index of next question
        let nextIndex = 0;

        // Update index
        if (this.activeQuestion != null) {
            nextIndex = this.activeQuestion.index + 1;
        }

        if (nextIndex >= this.questions.length) {
            // End of questions, and game
            this.gameOver();
        } else {
            // Update question through packet
            const q = this.questions[nextIndex];
            this.activeQuestion = new ActiveQuestion(q, nextIndex, currentTime, false);
            this.broadcast(question(q.question, q.answers), true);
        }
    }

    // Set game to game over, show scores etc
    gameOver() {
        this.setState(packets.GameState.FINISHED);

        // Remove from games map
        games.delete(this.id);
    }

    // Set the current game state for all players
    setState(state: packets.GameState) {
        this.state = state;
        this.broadcast(gameState(state), true);
    }

    // Remove player from the game
    removePlayer(player: Player) {
        if (this.state !== packets.GameState.FINISHED) {
            // Clear data from other players
            this.broadcastExcluding(player.id, playerData(player.id, player.name, 0, SPlayerDataType.REMOVE), true);
        }

        // Remove from game
        this.players.delete(player.id);
    }

    // Safely stop and cleanup game
    stop() {
        this.setState(packets.GameState.FINISHED);

        // Send disconnect to players
        this.players.forEach((player) => {
            this.removePlayer(player);
            packets.sendPacket(player.socket, disconnect('Game ended by host.'));
        });

        // Remove from games map
        games.delete(this.id);
    }

    // Creates a mostly unique player id
    private generatePlayerId() {
        const id: string = generateRandomId(6);

        if (!this.players.has(id)) return id;
        // Retry
        else return this.generatePlayerId();
    }
}

// Data for current question in game
class ActiveQuestion {
    question: packets.QuestionData; // Active question
    index: number; // Index of question in total questions
    startTime: number; // Millis when this question was asked
    markTime: number; // Millis when question was marked
    marked: boolean; // If question is marked (current question is after this question)
    skiped: boolean; // If this question has been skiped

    constructor(question: packets.QuestionData, index: number, startTime: number, marked: boolean) {
        this.question = question;
        this.index = index;
        this.startTime = startTime;
        this.marked = marked;
        this.skiped = false;
        this.markTime = -1;
    }

    // See if an answer is correct for a current question
    isCorrect(answerIndex: number): boolean {
        const correctAnswers = this.question.correct;
        return correctAnswers.includes(answerIndex);
    }
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

    games.set(id, game);

    // Start game loop that runs game logic
    game.gameLoop();

    return game;
}

// Generate a random game ID code
export const generateRandomId = (length: number) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
