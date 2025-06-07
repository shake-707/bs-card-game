const createGameButton = document.querySelector("#create-game-button");
const createGameContainer = document.querySelector("#create-game-container");
const closeButton = document.querySelector("#close-create-game-form");

const contentDiv = document.getElementById("content");
const userId = Number(contentDiv?.dataset.userId);


document.addEventListener("DOMContentLoaded", () => {
  

  createGameButton?.addEventListener("click", (e) => {
    e.preventDefault();
    createGameContainer?.classList.add("visible");
  });

  closeButton?.addEventListener("click", (event) => {
    event.preventDefault();
    createGameContainer?.classList.remove("visible");
  });
});
