
import { ChatMessage } from "../../../types/global";


import { socket } from "../sockets";

import { cloneTemplate, getGameId } from "../utils";


    const chatContainer = document.querySelector<HTMLDivElement>("#chat-container div#messages");
    const chatForm = document.querySelector<HTMLFormElement>("#chat-container form");
    const chatInput = document.querySelector<HTMLInputElement>("#chat-container input");

    const loadMessages = async () => {
        try {
            const res = await fetch(`/chat/${getGameId()}/getMessages`);

            if (!res.ok) {
            throw new Error(`Failed to fetch messages: ${res.statusText}`);
            }

            const dbMessages = await res.json() as ChatMessage[];

            if (Array.isArray(dbMessages)) {
            dbMessages.forEach((mess) => {
                const messageContainer = document.createElement("div");
                messageContainer.classList.add("message");
                const text = document.createElement("p");
                // @ts-ignore
                text.innerText = mess.sender;
                messageContainer.appendChild(text);
                const img = document.createElement("img");
                // @ts-ignore
                img.src = `http://gravatar.com/avatar/${mess.gravatar}?d=identicon`;
                // @ts-ignore
                img.alt = `Gravatar for ${mess.sender}`;
                img.classList.add("avatar");
                messageContainer.appendChild(img);

                

                const messageContent = document.createElement("span");
                messageContent.classList.add("message-content");
                
                messageContent.innerText = mess.message;

                const messageTimeStamp = document.createElement("span");
                messageTimeStamp.classList.add("message-timestamp");
                
                messageTimeStamp.innerText = new Date(mess.timestamp).toLocaleTimeString();

                messageContainer.appendChild(messageContent);
                messageContainer.appendChild(messageTimeStamp);
                

                chatContainer?.appendChild(messageContainer);

            });
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
            
            } else {
            console.log("Unexpected response:", dbMessages);
            }
        } catch (err) {
            console.error("Error loading messages:", err);
        }
    };

    loadMessages();
    
    

    socket?.on(`chat:message:${getGameId()}`, ({ message, sender, timestamp }: ChatMessage) => {
       
        
        // dbMessages.forEach((mess) => {
        //     const messageContainer = document.createElement("div");
        //     messageContainer.classList.add("message");
        //     const text = document.createElement("p");
        //     // @ts-ignore
        //     text.innerText = mess.sender;
        //     messageContainer.appendChild(text);
        //     const img = document.createElement("img");
        //     // @ts-ignore
        //     img.src = `http://gravatar.com/avatar/${mess.gravatar}?d=identicon`;
        //     // @ts-ignore
        //     img.alt = `Gravatar for ${mess.sender}`;
        //     img.classList.add("avatar");
        //     messageContainer.appendChild(img);

            

        //     const messageContent = document.createElement("span");
        //     messageContent.classList.add("message-content");
        //     // @ts-ignore
        //     messageContent.innerText = mess.message;

        //     const messageTimeStamp = document.createElement("span");
        //     messageTimeStamp.classList.add("message-timestamp");
        //     // @ts-ignore
        //     messageTimeStamp.innerText = new Date(mess.timestamp).toLocaleTimeString();

        //     messageContainer.appendChild(messageContent);
        //     messageContainer.appendChild(messageTimeStamp);

        //     chatContainer?.appendChild(messageContainer);

        // });
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

         if (chatContainer) {
             chatContainer.scrollTop = chatContainer.scrollHeight;
         }
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
