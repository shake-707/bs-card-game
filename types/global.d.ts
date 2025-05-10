import "express-session";

export type User = {
    id: string;
    email: string;
    gravatar: string;
    user_name: string;
};

export type ChatMessage = {
    message: string;
    sender: User;
    timestamp: Date;
};

export type Card = {
  id: number;
  value: number; // 0 = A, 12 = K
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
};

export type Player = {
  id: string;
  user_name: string;
  seat: number;
  isCurrent: boolean;
};

export type PlayerInfo = Player & {
  hand: Card[];
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
};

export type PlayerGameState = {
  currentPlayer: PlayerInfo;
  otherPlayers: Record<string, OtherPlayerInfo>;
  middlePile: Card[];
  currentTurn: number;
  currentValueIndex: number;
};

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}
