// Main server handler
import * as player from './player'

// Game object
type Game = {
    host: WebSocket; // Connection of the host
    id: number; // Game ID
    title: string; // Title of game
    questions: QuestionData[]; // All questions
    players: Map<string, player.PlayerData>; // Player's in game
    startTime: number; // Start time in millis
    state: number; // GameState ID
    activeQuestion: ActiveQuestion; // Current game question
};

// Current state of game
const GameState = {
    WAITING: 0x00, // Players can join
    ACTIVE: 0x01, // In session
    FINISHED: 0x02 // Game over
}

// Data for a question
type QuestionData = {
    question: string, // The question being asked
    answers: string[], // Answers for this question
    correct: string[] // All correct answers
}

// Data for current question in game
type ActiveQuestion = {
    question: QuestionData, // Active question
    index: number, // Index of question in total questions
    marked: boolean // If question is marked (current question is after this question)
}

// Current game sessions
const games = new Map<string, Game>()

// Get an active game from ID
const getGame = (id: string): Game | undefined => {
    const game: Game | undefined = games.get(id)
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