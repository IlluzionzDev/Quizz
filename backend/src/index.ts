// Express
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as packets from './packet/packets';
import * as gameServer from './game/server'
import { CAnswer, CCheckNameTaken, CCreateGame, CKick, CPID, CRequestGameState, CRequestJoin, CStateChange } from './packet/client';
import { SJoinedGame } from './packet/server';

// Initializes env variables
config();

// Env Variables
const { API_PORT } = process.env;

// API initialization
const app = express();

// Middlewares
app.use(cors());

// Create web socket server
const server = http.createServer(app);
// var expressWs = require('express-ws')(app);
const wss = new WebSocket.WebSocketServer({ server });

// Defines the type of packet handler function
type PacketHandlerFunction = (client: WebSocket, data: any) => void;
// Defines the packet handlers map which is id -> handler
type PacketHandlers = Record<CPID, PacketHandlerFunction>;

// Client packet handlers
const handlers: PacketHandlers = {
    [CPID.CCreateGame]: onCreateGame,
    [CPID.CCheckNameTaken]: onCheckNameTaken,
    [CPID.CRequestGameState]: onRequestGameState,
    [CPID.CRequestJoin]: onRequestJoin,
    [CPID.CStateChange]: onStateChange,
    [CPID.CAnswer]: onAnswer,
    [CPID.CKick]: onKick
};

// Client has connected to server
wss.on('connection', (ws: WebSocket) => {
    // Packet handler
    ws.send('Connected to Quizz Server!');

    // Handle packets from client
    ws.on('message', (data: WebSocket.RawData) => {
        const packet: packets.Packet = JSON.parse(data.toString()) as packets.Packet;
        const packetId: CPID = packet.id
        const packetData: any = packet.data

        // Valid packet
        if (packetId in handlers) {
            const handler = handlers[packetId]
            handler(ws, packetData);
        }
    });
});

function onCreateGame(client: WebSocket, data: CCreateGame) {
    const newGame = gameServer.newGame(client, data.title, data.questions)

    // Join host to new game
    const joinGamePacket: SJoinedGame = {
        owner: true,
        id: newGame.id,
        title: data.title
    }
    client.send(JSON.stringify(joinGamePacket));
}

function onCheckNameTaken(client: WebSocket, data: CCheckNameTaken) {}

function onRequestGameState(client: WebSocket, data: CRequestGameState) {
    console.log(data);
    client.send('Recieved Request Game State Packet')
}

function onRequestJoin(client: WebSocket, data: CRequestJoin) {}

function onStateChange(client: WebSocket, data: CStateChange) {}

function onAnswer(client: WebSocket, data: CAnswer) {}

function onKick(client: WebSocket, data: CKick) {}

// Start websocket server
server.listen(API_PORT, async () => {
    console.log(`Started Quizz backend on port ${API_PORT}`);
});
