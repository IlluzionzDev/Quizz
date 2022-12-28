// Handle connection to the server
import { HOST } from 'quiz-constants';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useRouter } from 'next/router';
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { clearState, removePlayer, setGameData, setGameState, setOpen, setQuestion, updatePlayers, updateScore } from 'store/clientSlice';
import { CStateChangeState, stateChange, kickPlayer } from './packets/client';
import { GameState, Packet } from './packets/packets';
import { SDisconnect, SError, SGameState, SJoinGame, SPID, SPlayerData, SPlayerDataType, SQuestion, SScores, STimeSync } from './packets/server';

// An empty function for handlers without a function
const EMPTY_HANDLER = () => null;

// Defines the type of packet handler function
type PacketHandlerFunction = (dispatch: Function, data: any) => void;
// Defines the packet handlers map which is id -> handler
type PacketHandlers = Record<SPID, PacketHandlerFunction>;

// Web socket connection
let socket: WebSocket | null;

/**
 * Record of packet IDs to handlers
 */
let handlers: PacketHandlers = {
    [SPID.SDisconnect]: onDisconnect,
    [SPID.SError]: onError,
    [SPID.SJoinGame]: onJoinGame,
    [SPID.SNameTakenResult]: EMPTY_HANDLER,
    [SPID.SGameState]: onGameState,
    [SPID.SPlayerData]: onPlayerData,
    [SPID.STimeSync]: EMPTY_HANDLER,
    [SPID.SQuestion]: onQuestion,
    [SPID.SAnswerResult]: EMPTY_HANDLER,
    [SPID.SScores]: onScores
};

/**
 * Creates a connection to the websocket at APP_HOST and returns the websocket
 * all the listeners are added to the websocket and the update interval is set
 */
function startListener(dispatch: Function, host: string) {
    // Create a new web socket instance
    if (!socket) socket = new WebSocket(host);

    // Set the handler for the websocket open event
    socket.onopen = () => {
        // Update the open state
        dispatch(setOpen(true));
    };

    // Set the handler for the websocket message event
    socket.onmessage = (event: MessageEvent) => {
        const packet: Packet = JSON.parse(event.data.toString());
        const packetId: SPID = packet.id;
        const packetData: any = packet.data;

        // Valid packet
        if (packetId in handlers) {
            const handler = handlers[packetId];
            handler(dispatch, packetData);
        }

        console.log(`Received packet ${event.data.toString()}`);
    };

    socket.onclose = () => {
        dispatch(setOpen(false));
        startListener(dispatch, HOST);
    };

    socket.onerror = console.error; // Directly print all errors to the console
}

/**
 * Packet handler for PlayerData packet (0x07) handles data about other
 * players in the game such as username and id's
 *
 * @param data The player data of the other player
 */
function onPlayerData(dispatch: Function, data: SPlayerData) {
    dispatch(updatePlayers(data));
}

/**
 * Packet handler for Scores packet (0x0A) handles the data about
 * the scores of each player in the game.
 * *
 * @param data The score data
 */
function onScores(dispatch: Function, data: SScores) {
    for (let dataKey in data.scores) {
        // Object to update score
        const playerData: SPlayerData = { id: dataKey, name: '', score: data.scores[dataKey], type: SPlayerDataType.SELF };
        dispatch(updateScore(playerData));
    }
}

/**
 * Packet handler for GameState packet (0x05) handles keeping track
 * of the games state
 *
 * @param data The current game state
 */
function onGameState(dispatch: Function, data: SGameState) {
    dispatch(setGameState(data.state));
}

/**
 * Packet handler for Question packet (0x08) which provides each
 * client with the current question to answer
 *
 * @param question The current question
 */
function onQuestion(dispatch: Function, question: SQuestion) {
    dispatch(setQuestion(question));
}

/**
 * Packet handler for the Disconnect packet (0x02) handles the player
 * being disconnected from the game
 *
 * @param data The disconnect data contains the reason for disconnect
 */
function onDisconnect(dispatch: Function, data: SDisconnect) {
    // Resetting state will kick to home page
    resetState(dispatch);
}

/**
 * Clears the associated persisted state for this socket
 */
function resetState(dispatch: Function) {
    dispatch(clearState());
}

/**
 * Packet handler for the Error packet (0x03) handles errors that should
 * be displayed to the client.
 *
 * @param data The data for the error packet contains the error cause
 */
function onError(dispatch: Function, data: SError) {
    console.error(`An error occurred ${data.cause}`); // Print the error to the console

    // Print to screen
}

/**
 * Packet handler for the Join Game packet (0x06) handles the player
 * joining the game. Sets the game code and emits relevant events
 *
 * @param data The data for the game contains the id and title
 */
function onJoinGame(dispatch: Function, data: SJoinGame) {
    // Set the game data to the provided value
    dispatch(setGameData(data));
    dispatch(setGameState(GameState.WAITING));
}

/**
 * Serializes the packet to json and sends it to the ws server.
 * Logs the packet to debug if isDebug is enabled
 *
 * @param packet The packet to send
 */
export function send(packet: Packet) {
    socket?.send(JSON.stringify(packet)); // Send json encoded packet data
}

/**
 * Called when the client should disconnect from the server. Clears the
 * update interval along with stopping the running loop and if the ws
 * connection is open according to isOpen then it will be closed as well
 */
export function disconnect(dispatch: Function) {
    send(stateChange(CStateChangeState.DISCONNECT)); // Send a disconnect packet
    resetState(dispatch);
}

/**
 * Removes a player from the game (HOST ONLY)
 *
 * @param id The id of the player to kick
 */
export function kick(dispatch: Function, id: string) {
    dispatch(removePlayer(id));
    send(kickPlayer(id)); // Send a kick player packet
}

/**
 * Hook into our packet listener clients. Ensures we are
 * listening for packets and updating client state.
 */
export function useClient() {
    const dispatch = useAppDispatch();

    // Load client after first render
    useEffect(() => {
        // Open client listener
        startListener(dispatch, HOST);
    }, []);
}

/**
 * A hook to ensure that the game instance is valid. So we
 * can make sure the player is in a game, otherwise redirect
 * them to other pages.
 *
 * @param client
 */
export function useRequireGame() {
    const router = useRouter();

    useGameState(GameState.NOT_FOUND, () => {
        // Route to home page
        router.push('/');
    });
}

/**
 * A hook to listen when the game enters a state and perform an action
 * *
 * @param client The client
 * @param state The state to run callback on
 * @param callback The callback function
 */
export function useGameState(state: GameState, callback: Function) {
    const gameState = useAppSelector((state) => state.client.gameState);

    useEffect(() => {
        if (gameState === state) {
            callback();
        }
    }, [gameState, callback, state]);
}

/**
 * Dynamically register a packet handler on a component
 *
 * @param id Packet id
 * @param handler The function that accepts the packet data
 */
export function usePacketHandler<D>(id: SPID, handler: (dispatch: Function, data: D) => any) {
    useEffect(() => {
        handlers[id] = handler;

        // Unregister handler after unmount
        return () => {
            handlers[id] = EMPTY_HANDLER;
        };
    }, []);
}

/**
 * Creates a timer reactive reference value which is linked to and updated by
 * the server synced time packets. This time will count down on its own
 * automatically but will always trust server time sync over its own time
 *
 * @param socket The socket instance to use synced time from
 * @param initialValue The initial time value to count from until time is synced
 */
export function useSyncedTimer(initialValue: number): number {
    // The actual value itself that should be displayed
    const [value, setValue] = useState<number>(initialValue);

    // Stores the last time in milliseconds that the counter ran a countdown animation
    let lastUpdateTime: number = -1;

    /**
     * Handles time sync packets (0x07) and updates
     * the current time based on that
     *
     * @param data The time sync packet data
     */
    function onTimeSync(dispatch: Function, data: STimeSync) {
        // Convert the remaining time to seconds and ceil it
        setValue(Math.ceil(data.remaining / 1000));
        // Set the last update time = now to prevent it updating again
        // and causing an accidental out of sync
        lastUpdateTime = performance.now();
        update();
    }

    /**
     * Run on browser animation frames used to update the time and count
     * down the timer every second. This is used to continue counting
     * so that the server doesn't have to send a large volume of time
     * updates and can instead send only a few every couple of second's
     * to sync up the times
     */
    function update() {
        // The value should not be changed if It's going to be < 0
        if (value - 1 >= 0) {
            const time = performance.now(); // Retrieve the current time
            const elapsed = time - lastUpdateTime; // Calculate the time passed since last update
            if (elapsed >= 1000) {
                // If 1 second has passed since the last update
                lastUpdateTime = time; // Set the last update time
                setValue((prev) => {
                    if (prev != 0) return prev - 1; // Timer can't go negative
                    return prev;
                });
            }
            // Request the next animation frame
            requestAnimationFrame(update);
        }
    }

    // Listen for time sync packets with onTimeSync
    usePacketHandler(SPID.STimeSync, onTimeSync);
    return value;
}
