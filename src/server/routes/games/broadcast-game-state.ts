// import { Card, GameState, PlayerInfo, OtherPlayerInfo } from "global";
// import { Server } from "socket.io";
// import { Game } from "../../db";

// const createPlayerState = (
//   game: GameState,
//   currentPlayer: PlayerInfo
// ) => {
//   const otherPlayers: Record<string, OtherPlayerInfo> = Object.entries(game.players)
//     .filter(([playerId]) => parseInt(playerId) !== currentPlayer.id)
//     .reduce((acc, [playerId, playerInfo]) => {
//       acc[playerId] = {
//         id: playerInfo.id,
//         user_name: playerInfo.user_name,
//         seat: playerInfo.seat,
//         handCount: playerInfo.hand.length,
//         isCurrent: playerInfo.isCurrent,
//       };
//       return acc;
//     }, {} as Record<string, OtherPlayerInfo>);

//   return {
//     currentPlayer,
//     otherPlayers,
//     middlePile: game.middlePile,
//     currentTurn: game.currentTurn,
//     currentValueIndex: game.currentValueIndex,
//   };
// };

// export const broadcastGameStateToPlayer = async (
//   gameId: number,
//   playerId: string,
//   io: Server
// ) => {
//   const gameState = await Game.getState(gameId);
//   const playerInfo = gameState.players[playerId];
//   if (!playerInfo) return;

//   io.to(playerId).emit(
//     `game:${gameId}:updated`,
//     createPlayerState(gameState, playerInfo)
//   );
// };

// export const broadcastGameState = async (gameId: number, io: Server) => {
//   const gameState = await Game.getState(gameId);

//   Object.entries(gameState.players).forEach(([playerId, playerInfo]) => {
//     io.to(playerId).emit(
//       `game:${gameId}:updated`,
//       createPlayerState(gameState, playerInfo)
//     );
//   });
//   console.log('finished');
// };
import { Card, GameState, PlayerInfo, OtherPlayerInfo } from "global";
import { Server } from "socket.io";
import { Game } from "../../db";

const createPlayerState = (
  game: GameState,
  currentPlayer: PlayerInfo
) => {
  const otherPlayers: Record<string, OtherPlayerInfo> = Object.entries(game.players)
    .filter(([playerId]) => parseInt(playerId) !== currentPlayer.id)
    .reduce((acc, [playerId, playerInfo]) => {
      acc[playerId] = {
        id: playerInfo.id,
        user_id: playerInfo.user_id,
        seat: playerInfo.seat,
        handCount: playerInfo.hand.length,
        isCurrent: playerInfo.isCurrent,
      };
      return acc;
    }, {} as Record<string, OtherPlayerInfo>);

  return {
    currentPlayer,
    otherPlayers,
    middlePile: game.middlePile,
    currentTurn: game.currentTurn,
    currentValueIndex: game.currentValueIndex,
  };
};

export const broadcastGameStateToPlayer = async (
  gameId: number,
  playerId: string,
  io: Server
) => {
  const gameState = await Game.getState(gameId);
  const playerInfo = gameState.players[playerId];
  if (!playerInfo) return;
  console.log("playerId" + playerId);
  io.to(playerId).emit(
    `game:${gameId}:updated`,
    createPlayerState(gameState, playerInfo)
  );
};

export const broadcastGameState = async (gameId: number, io: Server) => {
  const gameState = await Game.getState(gameId);
  
  Object.entries(gameState.players).forEach(([playerId, playerInfo]) => {
    console.log('player info:' + playerId);
    io.to(playerId).emit(
      `game:${gameId}:updated`,
      createPlayerState(gameState, playerInfo)
    );
  });
  console.log('finished');
};