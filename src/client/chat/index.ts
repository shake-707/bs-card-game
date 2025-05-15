
import { ChatMessage } from "../../../types/global";

import { socket } from "../sockets";

import { cloneTemplate, getGameId } from "../utils";


    const chatContainer = document.querySelector<HTMLDivElement>("#chat-container div#messages");
    const chatForm = document.querySelector<HTMLFormElement>("#chat-container form");
    const chatInput = document.querySelector<HTMLInputElement>("#chat-container input");

    

    socket?.on(`chat:message:${getGameId()}`, ({ message, sender, timestamp }: ChatMessage) => {
        console.log("Received chat message:", { message, sender, timestamp });
        console.log("game id: " + getGameId());
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message");
        const text = document.createElement("p");
        text.innerText = sender.user_name;
        messageContainer.appendChild(text);
        const img = document.createElement("img");
        img.src = `http://gravatar.com/avatar/${sender.gravatar}?d=identicon`;
        img.alt = `Gravatar for ${sender.email}`;
        img.classList.add("avatar");
        messageContainer.appendChild(img);
        

        const messageContent = document.createElement("span");
        messageContent.classList.add("message-content");
        messageContent.innerText = message;

        const messageTimeStamp = document.createElement("span");
        messageTimeStamp.classList.add("message-timestamp");
        messageTimeStamp.innerText = new Date(timestamp).toLocaleTimeString();

        messageContainer.appendChild(messageContent);
        messageContainer.appendChild(messageTimeStamp);

        chatContainer?.appendChild(messageContainer);
    });

    chatForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const message = chatInput?.value.trim();
        if (!message) return;

        chatInput!.value = "";

        fetch(`/chat/${getGameId()}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        }).catch((error) => {
            console.error("Error sending message:", error);
        });
    });
