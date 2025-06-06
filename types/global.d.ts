import "express-session";

export type User = {
    user_id: number;
    email: string;
    gravatar: string;
    user_name: string;
};

export type ChatMessage = {
    message: string;
    sender: User;
    timestamp: Date;
    user_name: string;
    dbMessages: string[];
    gravatar: string;
};

export type Card = {
  id: number;
  value: number; // 0 = A, 12 = K
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
};

export type Player = {
  id: number;
  user_id: number;
  seat: number;
  isCurrent: boolean;
};

export type PlayerInfo = {
  id: number;
  user_id: number;
  seat: number;
  isCurrent: boolean;
  hand: Card[];
  handCount: number;
  userName: string;
};

export type OtherPlayerInfo = {
  id: number;
  user_id: number;
  seat: number;
  handCount: number;
  isCurrent: boolean;
  userName: string;
};

export type GameInfo = {
  id: string;
  host_user_id: string;
  player_count: number;
  created_at: Date;
  game_end?: Date;
};

export type GameState = {
  currentTurn: number;
  currentValueIndex: number;
  middlePile: Card[];
  players: Record<string, PlayerInfo>;
  gameLogs: string[];
};

export type PlayerGameState = {
  currentPlayer: PlayerInfo;
  otherPlayers: Record<string, OtherPlayerInfo>;
  middlePile: Card[];
  currentTurn: number;
  currentValueIndex: number;
  gameLog: string[];
};

export type DbGameUser = {
  game_user_id: number;
  game_id: number;
  user_id: number;
  turn_order: number;
  cards_placed_down: number;
  game_user_won: boolean;
  is_current: boolean;
};

export type GetGameInfoResponse = {
  player_count: number;
  has_started: boolean;
};
