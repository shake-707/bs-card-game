import { Card, PlayerGameState, OtherPlayerInfo, GameState } from "global";
import { createCard } from "./create-card";
import elements from "../elements";
import { getGameId } from "../utils";
import { post } from "./fetch-wrapper";

export const drawGameScreen = (state: PlayerGameState,) => {
  const { currentPlayer, otherPlayers, middlePile, gameLog } = state;
  const container = elements.PLAY_AREA;
  if (!container) return;

  

  container.innerHTML = "";

  const rankLabels: Record<number, string> = {
    1: "A", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7",
    8: "8", 9: "9", 10: "10", 11: "J", 12: "Q", 13: "K",
  };
  const claimedRank = (state.currentValueIndex % 13) + 1;
  const valueBanner = document.createElement("div");
  valueBanner.id = "value-banner";
  valueBanner.innerText = `Claimed Rank: ${rankLabels[claimedRank]}`;
  container.appendChild(valueBanner);

  const isMyTurn = currentPlayer.isCurrent;
  

 
  const oppArray = Object.values(otherPlayers) as OtherPlayerInfo[];
  //console.log('my seat: ', currentPlayer.seat);
   const justPlayed = oppArray.some((opp) => {
      if (opp.isCurrent) {
        console.log("current seat: ", opp.seat);
      }
      return opp.isCurrent && opp.seat === (currentPlayer.seat % 4) + 1;
   });

   console.log(justPlayed);
   


  const makeOppDiv = (
    posClass: "side-opponent left" | "side-opponent right" | "top-opponent",
    info: OtherPlayerInfo
  ) => {
    const div = document.createElement("div");
    div.className = posClass;
    if (info.isCurrent) div.classList.add("current-turn");
    const userNameDiv = document.createElement("div");
    userNameDiv.appendChild(document.createTextNode(`${info.userName}`));
    div.appendChild(userNameDiv);
    div.appendChild(createCard());
    div.appendChild(document.createTextNode(`# of cards: ${info.handCount}`));
    return div;
  };

  console.log(currentPlayer.id);
  oppArray.forEach((opp) => {
    console.log('oponent id: ' + opp.id);
  })
  

  container.appendChild(
    makeOppDiv("side-opponent left", oppArray[0] ?? { handCount: 0, isCurrent: false } as any)
  );
  container.appendChild(
    makeOppDiv("side-opponent right", oppArray[1] ?? { handCount: 0, isCurrent: false } as any)
  );
  container.appendChild(
    makeOppDiv("top-opponent", oppArray[2] ?? { handCount: 0, isCurrent: false } as any)
  );

  // Middle pile
  const pileDiv = document.createElement("div");
  pileDiv.id = "card-pile";
  
  middlePile.forEach(() => pileDiv.appendChild(createCard()));
  
  const pileCards = pileDiv.querySelectorAll<HTMLDivElement>('.card');

  pileCards.forEach((card, i) => {
    card.style.zIndex = i.toString();
    card.style.transform = `rotate(${i * 4}deg)`;
  });

  //console.log('length of middle pile ', middlePile.length);
  const pileCountDiv = document.createElement("div");
  pileCountDiv.className = "pile-count";
  pileCountDiv.innerText = `(${middlePile.length} in pile)`;
  pileDiv.appendChild(pileCountDiv);

  container.appendChild(pileDiv);

  // User cards
  const userDiv = document.createElement("div");
  userDiv.id = "user-cards";
  if (isMyTurn) userDiv.classList.add("current-turn");

  const name = document.createElement("div");
  name.className = "player-name";
  name.innerText = currentPlayer.userName.toString();
  userDiv.appendChild(name);

  currentPlayer.hand.forEach((card) => {
    const playersHand = createCard(card).querySelector<HTMLDivElement>(".card")!;
    if (!isMyTurn) playersHand.classList.add("disabled");
    userDiv.appendChild(playersHand);
  });
  container.appendChild(userDiv);

  if (isMyTurn) {
    userDiv.querySelectorAll<HTMLDivElement>(".card").forEach((playerCard) => {
      playerCard.addEventListener("click", () => {
        const isSelected = playerCard.classList.contains('selected');
        const selectedCount = userDiv.querySelectorAll<HTMLDivElement>(".card.selected").length;

        if (isSelected) {
          playerCard.classList.remove('selected');
        } else if ( selectedCount < 4){
          playerCard.classList.toggle("selected");
        }  
      });
    });
  }

  // Play and BS buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.id = "play-controls";

  const playBtn = document.createElement("button");
  playBtn.id = "play-button";
  playBtn.className = "game-button";
  playBtn.innerText = "Play Cards";
  playBtn.disabled = !isMyTurn;

  const bsBtn = document.createElement("button");
  bsBtn.id = "bs-button";
  bsBtn.className = "game-button";
  bsBtn.innerText = "Call BS";
  bsBtn.disabled = !middlePile.length || justPlayed;
  


   
  buttonContainer.append(playBtn, bsBtn);
  container.appendChild(buttonContainer);

  // create game log
  const logDiv = document.createElement("div");
  const titleDiv = document.createElement("div");
  titleDiv.id = "title-div";
  const logTitle = document.createElement("h3");
  logTitle.innerHTML = 'Game Log';
  titleDiv.appendChild(logTitle);
  logDiv.appendChild(titleDiv);
  const addLogs = document.createElement('div');
  addLogs.id = "logs-container";
  logDiv.className = 'log-div';
  for (let i = 0; i < gameLog.length; i++) {
    const logP = document.createElement("p");
    logP.innerHTML = `Turn ${i + 1}: ` + gameLog[i]; 
    addLogs.appendChild(logP);
    
  }

  logDiv.appendChild(addLogs);
  container.appendChild(logDiv);
  addLogs.scrollTop = addLogs.scrollHeight;


  console.log('my handcount: ',currentPlayer.handCount );
  if (currentPlayer.handCount === 0) {
    fetch(`/games/${getGameId()}/check-winner`)
    .then((res) => res.json())
    .then((data) => {
      if (data.winner) {
        alert(`Player ${data.winner} has won the game!`);
        window.location.href = "/lobby";
      } else {
        fetch(`/games/${getGameId()}/ping`, {
          method: "POST",
        });
      }
    })
    .catch((err) => {
      console.error("Failed to check winner:", err);
    });
  }

  // === Check for game winner via backend ===
  console.log('currentplayer: id ' + currentPlayer.id);
  

    

};
