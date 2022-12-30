import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from 'api/packets/packets';
import { SJoinGame, SPlayerData, SPlayerDataType, SQuestion } from 'api/packets/server';

type PlayerMap = Record<string, SPlayerData>;

interface ClientState {
    open: boolean;
    gameData: SJoinGame | null;
    players: PlayerMap;
    question: SQuestion | null;
    gameState: GameState;
    selfData: SPlayerData | null;
}

const initialState: ClientState = {
    open: false,
    gameData: null,
    players: {},
    question: null,
    gameState: GameState.UNSET,
    selfData: null
};

const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        setOpen: (state, action: PayloadAction<boolean>) => {
            state.open = action.payload;
        },

        setGameData: (state, action: PayloadAction<SJoinGame>) => {
            state.gameData = action.payload;
        },

        updatePlayers: (state, action: PayloadAction<SPlayerData>) => {
            const data: SPlayerData = action.payload;

            // Player data instance
            const playerData: SPlayerData = { id: data.id, name: data.name, score: 0, type: SPlayerDataType.SELF };

            // Update data based on add type
            if (data.type === SPlayerDataType.ADD || data.type === SPlayerDataType.SELF) {
                // If the mode is ADD or SELF
                state.players[data.id] = playerData; // Assign the ID in the player map
                if (data.type === SPlayerDataType.SELF) {
                    // If the mode is SELF
                    state.selfData = playerData; // Set the self player to the player data
                }
            } else if (data.type === SPlayerDataType.REMOVE) {
                // if the mode is REMOVE
                delete state.players[data.id]; // Remove the ID from the player map
            }
        },

        removePlayer: (state, action: PayloadAction<string>) => {
            delete state.players[action.payload];
        },

        updateScore: (state, action: PayloadAction<SPlayerData>) => {
            const playerData: SPlayerData = { id: action.payload.id, name: state.players[action.payload.id].name, score: action.payload.score, type: SPlayerDataType.ADD };
            state.players[action.payload.id] = playerData;

            if (action.payload.id === state.selfData?.id) {
                // Update self score
                state.selfData.score = action.payload.score;
            }
        },

        setQuestion: (state, action: PayloadAction<SQuestion>) => {
            state.question = action.payload;
        },

        setGameState: (state, action: PayloadAction<GameState>) => {
            state.gameState = action.payload;
        },

        clearState: (state) => {
            state.open = true;
            state.gameData = initialState.gameData;
            state.players = initialState.players;
            state.question = initialState.question;
            state.gameState = initialState.gameState;
            state.selfData = initialState.selfData;
        }
    }
});

export const { setOpen, setGameData, updatePlayers, removePlayer, updateScore, setQuestion, setGameState, clearState } = clientSlice.actions;

export default clientSlice.reducer;
