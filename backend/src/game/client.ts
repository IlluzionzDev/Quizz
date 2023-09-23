import * as packets from '../packet/packets';
import * as gameServer from '../game/server';
import { CAnswer, CCheckNameTaken, CCreateGame, CKick, CPID, CRequestGameState, CRequestJoin, CStateChange, CStateChangeState } from '../packet/client';
import { disconnect, error, gameState, joinGame, nameTakenResult } from '../packet/server';
import { Player } from '../game/player';
import { Socket } from 'socket.io';

// An instance of a web client. Contains handlers for client requests
// Stores state of our client
export class Client {
    // Socket connection
    socket: Socket;
    // Current game instance if this client is the host
    hostGame?: gameServer.Game;
    // Current player game
    game?: gameServer.Game;
    // Current player instance
    player?: Player;

    // Client packet handlers
    handlers: packets.PacketHandlers = {
        [CPID.CCreateGame]: this.onCreateGame.bind(this),
        [CPID.CCheckNameTaken]: this.onCheckNameTaken.bind(this),
        [CPID.CRequestGameState]: this.onRequestGameState.bind(this),
        [CPID.CRequestJoin]: this.onRequestJoin.bind(this),
        [CPID.CStateChange]: this.onStateChange.bind(this),
        [CPID.CAnswer]: this.onAnswer.bind(this),
        [CPID.CKick]: this.onKick.bind(this)
    };

    constructor(socket: Socket) {
        this.socket = socket;
    }

    // Connect this client instance to the server and setup all handlers
    connect() {
        // Handle packets from client
        this.socket.on('message', (socket: Object) => {
            const packet: packets.Packet = JSON.parse(socket.toString());
            const packetId: CPID = packet.id;
            const packetData: any = packet.data;

            // Valid packet
            if (packetId in this.handlers) {
                const handler = this.handlers[packetId];
                handler(this.socket, packetData);
            } else {
                console.error(`Recieved invalid packet with id ${packet.id}`);
            }

            // Backend packet logging
            console.log(`Received packet ${socket.toString()}`);
        });

        this.socket.on('disconnect', () => {
            // When client is closed, remove all player instances
            this.cleanUp();
        });
    }

    onCreateGame(client: Socket, data: CCreateGame) {
        const newGame = gameServer.newGame(client, data.title, data.questions);

        console.log('creating game');

        // Set this client to be host of the game
        this.hostGame = newGame;
        // Join player to game as host
        packets.sendPacket(client, joinGame(true, newGame.id, data.title));
        // Set game state to waiting
        packets.sendPacket(client, gameState(packets.GameState.WAITING));
    }

    onCheckNameTaken(client: Socket, data: CCheckNameTaken) {
        const game = gameServer.getGame(data.id);
        if (!game) {
            packets.sendPacket(client, error('Game does not exist'));
        } else {
            // Inform of result
            const result: boolean = game.isNameTaken(data.name);
            packets.sendPacket(client, nameTakenResult(result));
        }
    }

    onRequestGameState(client: Socket, data: CRequestGameState) {
        const game = gameServer.getGame(data.id);
        packets.sendPacket(client, gameState(game ? game.state : packets.GameState.NOT_FOUND));
    }

    onRequestJoin(client: Socket, data: CRequestJoin) {
        const game = gameServer.getGame(data.id);
        if (!game) {
            packets.sendPacket(client, error('Game does not exist'));
        } else {
            // Check if game exists and can use this name
            if (game.state != packets.GameState.WAITING) {
                packets.sendPacket(client, error('Game already started'));
                // Server check if name is taken
            } else if (game.isNameTaken(data.name)) {
                packets.sendPacket(client, error('Name is taken'));
            } else {
                // Join game instance
                this.player = game.addPlayer(client, data.name);
                this.game = game;
                // Join as regular player
                packets.sendPacket(client, joinGame(false, game.id, game.title));
            }
        }
    }

    onStateChange(client: Socket, data: CStateChange) {
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
                } else {
                    // Skip current question
                    this.hostGame.skipQuestion();
                }
                return;
            default:
                return;
        }
    }

    onAnswer(client: Socket, data: CAnswer) {
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

    onKick(client: Socket, data: CKick) {
        // Kick a player from the game (Host only)
        if (this.hostGame != null) {
            const player = this.hostGame.players.get(data.id);
            if (player) {
                this.hostGame.removePlayer(player);

                // Send disconnect to player
                packets.sendPacket(player.socket, disconnect('Kicked from game!'));
            }
        }
    }

    // Cleanup client games
    cleanUp() {
        // If this is the host disconnecting, stop the game
        if (this.hostGame != null) {
            this.hostGame.stop();
            this.hostGame = undefined;
        }

        if (this.game != null && this.player != null) {
            this.game.removePlayer(this.player);
            this.game = undefined;
            this.player = undefined;
        }
    }
}
