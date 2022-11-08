// A player instance is created when joining a game instance
type PlayerData = {
    socket: WebSocket; // Client connection
    id: string; // Player id
    name: string; // Name of player in game
    score: number; // Aquired score
    answers: Map<number, number>; // Selected answers
    answerTime: number; // Amount of millis took to answer question
};

export { PlayerData };
