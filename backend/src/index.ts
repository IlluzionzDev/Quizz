// Express
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import * as http from 'http';

import { Client } from './game/client';
import { Server, Socket } from 'socket.io';

// Initializes env variables
config();

// Remove logging in prod env
if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.error = () => {};
    console.debug = () => {};
}

// Env Variables
const { API_PORT } = process.env;

// API initialization
const app = express();

// Middlewares
app.use(cors());

// Create web socket server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Client has connected to server
io.on('connection', (socket: Socket) => {
    // Client instance
    const client = new Client(socket);
    client.connect();
});

// Start websocket server
server.listen(API_PORT, async () => {
    console.log(`Started Quizz backend on port ${API_PORT}`);
});
