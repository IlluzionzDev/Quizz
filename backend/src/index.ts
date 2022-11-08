// Express
import express from 'express';
import { Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import * as http from 'http';
import * as WebSocket from 'ws';

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

// Client has connected
wss.on('connection', (ws: WebSocket) => {
    // Packet handler
    ws.send('Connected to Quizz Server!');

    const question = {
        question: 'This is a test question'
    }

    ws.send(JSON.stringify(question));

    // Handle packets from client
    ws.on('message', (data: WebSocket.RawData) => {
        console.log(data.toString())
    })
});

const router = express.Router();
router.get('/', async (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Test' });
});
app.use('/', router);

// Start server
server.listen(API_PORT, async () => {
    console.log(`Started Quizz backend on port ${API_PORT}`);
});
