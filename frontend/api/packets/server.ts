// Server packet ids
export enum SPID {
  SDisconnect = 0x00,
  SError,
  SJoinGame,
  SNameTakenResult,
  SGameState,
  SPlayerData,
  STimeSync,
  SQuestion,
  SAnswerResult,
  SScores,
}

// Disconnect a user from the game
export interface SDisconnect {
  reason: string;
}

// Error on the game server
export interface SError {
  cause: string;
}

// Joined a quiz
export interface SJoinGame {
  owner: boolean; // If created this game
  id: string; // Id of the game
  title: string; // Title of quiz
}

// Result of checking if name is taken
export interface SNameTakenResult {
  result: boolean; // If name is taken
}

// Return of current joined game state
export interface SGameState {
  state: number; // ID of game state
}

// Contains data about a player in a game
export interface SPlayerData {
  id: string; // Player id
  name: string; // Player name
  score: number; // Score of player
  type: SPlayerDataType; // Mode for player data
}

export enum SPlayerDataType {
  ADD = 0x00,
  REMOVE,
  SELF,
}

// Server time for game to sync up
export interface STimeSync {
  total: number; // Total game time
  remaining: number; // Remaining game time
}

// Current question data
export interface SQuestion {
  question: string; // String question
  answers: string[]; // Available answers
}

// If chosen answer was correct
export interface SAnswerResult {
  result: boolean; // If was correct
}

// Updated scores for the game
export interface SScores {
  scores: Map<number, string>; // Player scores
}
