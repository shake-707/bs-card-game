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