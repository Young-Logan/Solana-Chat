// src/config/tokens.ts

export interface Channel {
    id: string;
    name: string;
    description: string;
    requiresToken: boolean;
}

export interface ChatRoom {
    id: string;
    name: string;
    tokenMint: string;
    minTokens: number;
    description: string;
    channels: Channel[];
}

export const CHAT_ROOMS: ChatRoom[] = [
    {
        id: 'test-token-chat',
        name: 'Test Token Chat',
        tokenMint: '8eBK8oodK5d8DLHD2uXjpa2GCREEBPeCKZUiY7XcZMev', // Your token
        minTokens: 0,
        description: 'Chat room for test token holders',
        channels: [
            {
                id: 'public',
                name: '💬 Public Discussion',
                description: 'Open chat for everyone interested in our token',
                requiresToken: false
            },
            {
                id: 'holders',
                name: '🔒 Token Holders',
                description: 'Exclusive chat for token holders only',
                requiresToken: true
            }
        ]
    }
];

// Use devnet for testing
export const NETWORK_CONFIG = {
    endpoint: 'https://api.devnet.solana.com',
};