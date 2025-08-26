'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { database } from '@/config/firebase';
import { ref, push, onValue, off } from 'firebase/database';

interface ChatMessage {
    id: string;
    sender: string;
    content: string;
    timestamp: number;
    senderAddress: string;
    roomId: string;
    channelId: string;
    isTokenHolder: boolean;
}

interface ChatProps {
    roomId: string;
    channelId: string;
    isTokenHolder: boolean;
}

export const Chat: FC<ChatProps> = ({ roomId, channelId, isTokenHolder }) => {
    const { publicKey } = useWallet();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        // Reference to the specific room and channel in Firebase
        const messagesRef = ref(database, `messages/${roomId}/${channelId}`);

        // Listen for messages
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messageList = Object.values(data) as ChatMessage[];
                setMessages(messageList.sort((a, b) => a.timestamp - b.timestamp));
            } else {
                setMessages([]);
            }
        });

        // Cleanup listener on unmount
        return () => {
            off(messagesRef);
        };
    }, [roomId, channelId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!publicKey || !newMessage.trim()) return;

        const message: ChatMessage = {
            id: Date.now().toString(),
            sender: publicKey.toString().slice(0, 4) + '...' + publicKey.toString().slice(-4),
            content: newMessage.trim(),
            timestamp: Date.now(),
            senderAddress: publicKey.toString(),
            roomId,
            channelId,
            isTokenHolder
        };

        // Push the message to Firebase
        const messagesRef = ref(database, `messages/${roomId}/${channelId}`);
        await push(messagesRef, message);
        setNewMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full bg-white rounded-lg shadow">
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.senderAddress === publicKey?.toString() ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                    msg.senderAddress === publicKey?.toString()
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-900'
                                }`}
                            >
                                <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                                    {msg.sender}
                                    {msg.isTokenHolder && (
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                            Token Holder
                                        </span>
                                    )}
                                </div>
                                <div className="break-words">{msg.content}</div>
                                <div className="text-xs mt-1 opacity-70">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="border-t p-4">
                <div className="flex gap-2">
                    <textarea
                        className="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={1}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};