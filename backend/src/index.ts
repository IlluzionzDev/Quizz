// Express
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as packets from './packet/packets';
import * as gameServer from './game/server';
import { CAnswer, CCheckNameTaken, CCreateGame, CKick, CPID, CRequestGameState, CRequestJoin, CStateChange, CStateChangeState } from './packet/client';
import { error, gameState, joinGame, nameTakenResult } from './packet/server';
import { Player } from './game/player';

// Initializes env variables
config();

// Env Variables
const { API_PORT } = process.env;

// API initialization
const app = express();

// Middlewares
app.use(cors());

// Create web socket server at '/ws'
const server = http.createServer(app);
const wss = new WebSocket.WebSocketServer({ server, path: '/ws' });

// Defines the type of packet handler function
type PacketHandlerFunction = (client: WebSocket, data: any) => void;
// Defines the packet handlers map which is id -> handler
type PacketHandlers = Record<CPID, PacketHandlerFunction>;

// Client has connected to server
wss.on('connection', (ws: WebSocket) => {
    // Packet handler
    ws.send('Connected to Quizz Server!');

    // Client instance
    const client = new Client(ws);
    client.connect();
});

// An instance of a web client. Contains handlers for client requests
// Stores state of our client
class Client {
    // Socket connection
    socket: WebSocket;
    // Current game instance if this client is the host
    hostGame?: gameServer.Game;
    // Current player game
    game?: gameServer.Game;
    // Current player instance
    player?: Player;

    // Client packet handlers
    handlers: PacketHandlers = {
        [CPID.CCreateGame]: this.onCreateGame.bind(this),
        [CPID.CCheckNameTaken]: this.onCheckNameTaken.bind(this),
        [CPID.CRequestGameState]: this.onRequestGameState.bind(this),
        [CPID.CRequestJoin]: this.onRequestJoin.bind(this),
        [CPID.CStateChange]: this.onStateChange.bind(this),
        [CPID.CAnswer]: this.onAnswer.bind(this),
        [CPID.CKick]: this.onKick.bind(this)
    };

    constructor(socket: WebSocket) {
        this.socket = socket;
    }

    // Connect this client instance to the server and setup all handlers
    connect() {
        // Handle packets from client
        this.socket.on('message', (data: WebSocket.RawData) => {
            const packet: packets.Packet = JSON.parse(data.toString());
            const packetId: CPID = packet.id;
            const packetData: any = packet.data;

            // Valid packet
            if (packetId in this.handlers) {
                const handler = this.handlers[packetId];
                handler(this.socket, packetData);
            }
        });
    }

    onCreateGame(client: WebSocket, data: CCreateGame) {
        const newGame = gameServer.newGame(client, data.title, data.questions);

        // Set this client to be host of the game
        this.hostGame = newGame;
        // Join player to game as host
        packets.sendPacket(client, joinGame(true, newGame.id, data.title));
        // Set game state to waiting
        packets.sendPacket(client, gameState(packets.GameState.WAITING));
    }

    onCheckNameTaken(client: WebSocket, data: CCheckNameTaken) {
        const game = gameServer.getGame(data.id);
        if (!game) {
            packets.sendPacket(client, error('Game does not exist'));
        } else {
            // Inform of result
            const result: boolean = game.isNameTaken(data.name);
            packets.sendPacket(client, nameTakenResult(result));
        }
    }

    onRequestGameState(client: WebSocket, data: CRequestGameState) {
        const game = gameServer.getGame(data.id);
        if (!game) {
            packets.sendPacket(client, gameState(packets.GameState.NOT_FOUND));
        } else {
            packets.sendPacket(client, gameState(game.state));
        }
    }

    onRequestJoin(client: WebSocket, data: CRequestJoin) {
        const game = gameServer.getGame(data.id);
        if (!game) {
            packets.sendPacket(client, error('Game does not exist'));
        } else {
            // Check if game exists and can use this name
            if (game.state != packets.GameState.WAITING) {
                packets.sendPacket(client, error('Game already started'));
                // Internal check if name is taken
            } else if (game.isNameTaken(data.name)) {
                packets.sendPacket(client, error('Game already started'));
            } else {
                // Join game instance
                this.player = game.addPlayer(client, data.name);
                this.game = game;
                // Join as regular player
                packets.sendPacket(client, joinGame(false, game.id, game.title));
            }
        }
    }

    onStateChange(client: WebSocket, data: CStateChange) {
        // Perform state change
        switch (data.state) {
            case CStateChangeState.DISCONNECT:
                // Cleanup on disconnect
                this.cleanUp();
                return;
            case CStateChangeState.START:
                if (this.hostGame == null) {
                    packets.sendPacket(client, error('Failed to update game state. You are not the host.'));
                } else if (this.hostGame.state !== packets.GameState.WAITING) {
                    packets.sendPacket(client, error('Game already started'));
                } else {
                    // Start the game
                    this.hostGame.start();
                }
                return;
            case CStateChangeState.SKIP:
                if (this.hostGame == null) {
                    packets.sendPacket(client, error('Failed to update game state. You are not the host.'));
                } else if (this.hostGame.state !== packets.GameState.WAITING) {
                    packets.sendPacket(client, error('Game already started'));
                } else {
                    // Skip current question
                    this.hostGame.skipQuestion();
                }
                return;
            default:
                return;
        }
    }

    onAnswer(client: WebSocket, data: CAnswer) {
        if (this.game == null || this.player == null) {
            // Check if not in a game
            packets.sendPacket(client, error('Not in a game'));
        } else if (this.player.hasAnswered(this.game)) {
            packets.sendPacket(client, error('You have already answered the question'));
        } else {
            // Answer the question
            this.player.answer(this.game, data.id);
        }
    }

    onKick(client: WebSocket, data: CKick) {
        // Kick a player from the game (Host only)
        if (this.hostGame != null) {
            const player = this.hostGame.players.get(data.id);
            if (player) this.hostGame.removePlayer(player);
        }
    }

    // Cleanup client games
    cleanUp() {
        // Stop host games
        if (this.hostGame != null) {
            this.hostGame.stop()
            this.hostGame = undefined
        }

        if (this.game != null && this.player != null) {
            this.game.removePlayer(this.player)
            this.game = undefined;
            this.player = undefined;
        }
    }
}

// Start websocket server
server.listen(API_PORT, async () => {
    console.log(`Started Quizz backend on port ${API_PORT}`);
});
