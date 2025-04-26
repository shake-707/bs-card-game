
import { ChatMessage } from "../../../types/global";

import { socket } from "../sockets";




    const chatContainer = document.querySelector<HTMLDivElement>("#chat-container div#messages");
    const chatForm = document.querySelector<HTMLFormElement>("#chat-container form");
    const chatInput = document.querySelector<HTMLInputElement>("#chat-container input");

    

    socket?.on("chat: message: 0", ({ message, sender, timestamp }: ChatMessage) => {
        console.log("📥 Received chat message:", { message, sender, timestamp });

        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message");
        
        const img = document.createElement("img");
        img.src = `http://gravatar.com/avatar/${sender.gravatar}?d=identicon`;
        img.alt = `Gravatar for ${sender.email}`;
        img.classList.add("avatar");
        messageContainer.appendChild(img);
        messageContainer.innerText = `${sender.user_name}`;

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

        fetch("/chat/0", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        }).catch((error) => {
            console.error("Error sending message:", error);
        });
    });
