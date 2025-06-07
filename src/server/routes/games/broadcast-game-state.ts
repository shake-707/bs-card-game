import { Card, GameState, PlayerInfo, OtherPlayerInfo } from "global";
import { Server } from "socket.io";
import { Game } from "../../db";


const createPlayerState = (
  game: GameState,
  currentPlayer: PlayerInfo
) => {
  const otherPlayers: Record<string, OtherPlayerInfo> = Object.entries(game.players)
    .filter(([playerId]) => {
      //console.log('playerId is: ' + playerId + ', currentPlayer.id is' + currentPlayer.user_id);
      return parseInt(playerId) !== currentPlayer.user_id;
    })
    .reduce((acc, [playerId, playerInfo]) => {
      acc[playerId] = {
        id: playerInfo.id,
        user_id: playerInfo.user_id,
        seat: playerInfo.seat,
        handCount: playerInfo.hand.length,
        isCurrent: playerInfo.isCurrent,
        userName: playerInfo.userName,
      };
      return acc;
    }, {} as Record<string, OtherPlayerInfo>);
    //console.log('other players are', otherPlayers);
  return {
    currentPlayer,
    otherPlayers,
    middlePile: game.middlePile,
    currentTurn: game.currentTurn,
    currentValueIndex: game.currentValueIndex,
    gameLog: game.gameLogs,
  };
};

export const broadcastGameStateToPlayer = async (
  gameId: number,
  playerId: string,
  io: Server
) => {
  const gameState = await Game.getState(gameId);
  // playerId is user_id not game_user_id
  const playerInfo = gameState.players[playerId];
  if (!playerInfo) return;
  console.log("inside broadcast state to player, playerId" + playerId);
  io.to(playerId).emit(
    `game:${gameId}:updated`,
    createPlayerState(gameState, playerInfo)
  );

};

export const broadcastGameState = async (gameId: number, io: Server) => {
  const gameState = await Game.getState(gameId);
  
  Object.entries(gameState.players).forEach(([playerId, playerInfo]) => {
    console.log('inside broadcast GameState player info:' + playerId);
    io.to(playerId).emit(
      `game:${gameId}:updated`,
      createPlayerState(gameState, playerInfo)
    );
  });
  console.log('finished');
};