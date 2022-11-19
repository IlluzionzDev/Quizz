// Handle connection to the server
import { CStateChangeState, kick, stateChange } from './packets/client';
import { GameState, Packet } from './packets/packets';
import { SDisconnect, SError, SGameState, SJoinGame, SPID, SPlayerData, SPlayerDataType, SQuestion, SScores } from './packets/server';

// Defines a map of local player data
type PlayerMap = Record<string, SPlayerData>;

// An empty function for handlers without a function
const EMPTY_HANDLER = () => null;

// Defines the type of packet handler function
type PacketHandlerFunction = (data: any) => void;
// Defines the packet handlers map which is id -> handler
type PacketHandlers = Record<SPID, PacketHandlerFunction>;

// An instance of our web client. Handles state and listens
// for server packets
export class Client {
    private readonly host: string;
    private socket: WebSocket;

    // If the client connection is open
    open: boolean = false;
    // The current game data of joined game
    gameData?: SJoinGame | null;
    // All local players in game
    players: PlayerMap = {};
    // Current question in the game
    question?: SQuestion | null;
    // Current game state
    gameState: GameState = GameState.NOT_FOUND;
    // Our own player data
    selfData?: SPlayerData | null;

    handlers: PacketHandlers = {
        [SPID.SDisconnect]: this.onDisconnect.bind(this),
        [SPID.SError]: this.onError.bind(this),
        [SPID.SJoinGame]: this.onJoinGame.bind(this),
        [SPID.SNameTakenResult]: EMPTY_HANDLER,
        [SPID.SGameState]: this.onGameState.bind(this),
        [SPID.SPlayerData]: this.onPlayerData.bind(this),
        [SPID.STimeSync]: EMPTY_HANDLER,
        [SPID.SQuestion]: this.onQuestion.bind(this),
        [SPID.SAnswerResult]: EMPTY_HANDLER,
        [SPID.SScores]: this.onScores.bind(this)
    };

    constructor(host: string) {
        this.host = host;
        this.socket = this.connect(host);
    }

    /**
     * Creates a connection to the websocket at APP_HOST and returns the websocket
     * all the listeners are added to the websocket and the update interval is set
     */
    connect(host: string): WebSocket {
        const ws = new WebSocket(host); // Create a new web socket instance

        // Set the handler for the websocket open event
        ws.onopen = () => {
            this.open = true; // Update the open state
        };

        // Set the handler for the websocket message event
        ws.onmessage = (event: MessageEvent) => {
            const packet: Packet = JSON.parse(event.data.toString());
            const packetId: SPID = packet.id;
            const packetData: any = packet.data;

            // Valid packet
            if (packetId in this.handlers) {
                const handler = this.handlers[packetId];
                handler(packetData);
            }

            console.log(`Received packet ${event.data.toString()}`);
        };

        ws.onclose = () => {
            this.open = false; // Update the open state
            this.retryConnect(); // Try and reconnect to the server
        };

        ws.onerror = console.error; // Directly print all errors to the console

        return ws;
    }

    /**
     * Retries connecting to the websocket server in 2 seconds and resets the
     * game state
     */
    retryConnect() {
        if (this.open) {
            // If the connection is open
            this.socket.close(); // Close the connection
            this.open = false; // Set the open state
        }
        // Print a debug message saying the connection was lost
        // Set a timeout to try and connect again in 2s
        setTimeout(() => (this.socket = this.connect(this.host)), 2000);
    }

    /**
     * Packet handler for PlayerData packet (0x07) handles data about other
     * players in the game such as username and id's
     *
     * @param data The player data of the other player
     */
    onPlayerData(data: SPlayerData) {
        // Create a copy of the player data without the mode and a score of 0
        const playerData: SPlayerData = { id: data.id, name: data.name, score: 0, type: SPlayerDataType.SELF };

        if (data.type === SPlayerDataType.ADD || data.type === SPlayerDataType.SELF) {
            // If the mode is ADD or SELF
            this.players[data.id] = playerData; // Assign the ID in the player map
            if (data.type === SPlayerDataType.SELF) {
                // If the mode is SELF
                this.selfData = playerData; // Set the self player to the player data
            }
        } else if (data.type === SPlayerDataType.REMOVE) {
            // if the mode is REMOVE
            delete this.players[data.id]; // Remove the ID from the player map
        }
    }

    /**
     * Packet handler for Scores packet (0x0A) handles the data about
     * the scores of each player in the game.
     * *
     * @param data The score data
     */
    onScores(data: SScores) {
        for (let dataKey in data.scores) {
            const player = this.players[dataKey];
            if (player) {
                player.score = data.scores[dataKey];
            }
        }
    }

    /**
     * Packet handler for GameState packet (0x05) handles keeping track
     * of the games state
     *
     * @param data The current game state
     */
    onGameState(data: SGameState) {
        this.gameState = data.state; // Set the game state
    }

    /**
     * Packet handler for Question packet (0x08) which provides each
     * client with the current question to answer
     *
     * @param question The current question
     */
    onQuestion(question: SQuestion) {
        this.question = question; // Set the question value
    }

    /**
     * Packet handler for the Disconnect packet (0x02) handles the player
     * being disconnected from the game
     *
     * @param data The disconnect data contains the reason for disconnect
     */
    onDisconnect(data: SDisconnect) {
        if (this.gameState !== GameState.FINISHED) {
            // Display disconnect to screen
        }

        this.resetState();

        // TODO: Route to home page
    }

    /**
     * Clears the associated persisted state for this socket
     */
    resetState() {
        this.selfData = null;
        this.gameData = null;
        this.question = null;
        this.gameState = GameState.NOT_FOUND;
        for (let key of Object.keys(this.players)) {
            delete this.players[key];
        }
    }

    /**
     * Packet handler for the Error packet (0x03) handles errors that should
     * be displayed to the client.
     *
     * @param data The data for the error packet contains the error cause
     */
    onError(data: SError) {
        console.error(`An error occurred ${data.cause}`); // Print the error to the console

        // Print to screen
    }

    /**
     * Packet handler for the Join Game packet (0x06) handles the player
     * joining the game. Sets the game code and emits relevant events
     *
     * @param data The data for the game contains the id and title
     */
    onJoinGame(data: SJoinGame) {
        // Set the game data to the provided value
        this.gameData = data;
        this.gameState = GameState.WAITING;
    }

    /**
     * Serializes the packet to json and sends it to the ws server.
     * Logs the packet to debug if isDebug is enabled
     *
     * @param packet The packet to send
     */
    send(packet: Packet) {
        this.socket.send(JSON.stringify(packet)); // Send json encoded packet data
    }

    /**
     * Called when the client should disconnect from the server. Clears the
     * update interval along with stopping the running loop and if the ws
     * connection is open according to isOpen then it will be closed as well
     */
    disconnect() {
        this.send(stateChange(CStateChangeState.DISCONNECT)); // Send a disconnect packet
        this.resetState();
    }

    /**
     * Removes a player from the game (HOST ONLY)
     *
     * @param id The id of the player to kick
     */
    kick(id: string) {
        delete this.players[id]; // Remove the player for the map
        this.send(kick(id)); // Send a kick player packet
    }
}

// Create instance of our client connection
let client: Client;
const isBrowser = typeof window !== 'undefined';

export function useClient(): Client {
    if (isBrowser) {
        const host = process.env.HOST ?? 'ws://localhost:4000';
        if (!client) client = new Client(host);
    }
    return client;
}
