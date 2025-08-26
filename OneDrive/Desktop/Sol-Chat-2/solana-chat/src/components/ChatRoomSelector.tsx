'use client';

import { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { CHAT_ROOMS, ChatRoom } from '@/config/tokens';

interface ChatRoomAccess {
    room: ChatRoom;
    hasAccess: boolean;
    loading: boolean;
}

export const ChatRoomSelector: FC<{
    onSelectRoom: (room: ChatRoom) => void;
    selectedRoom?: ChatRoom;
}> = ({ onSelectRoom, selectedRoom }) => {
    const { connection } = useConnection();
    const { connected, publicKey } = useWallet();
    const [roomAccess, setRoomAccess] = useState<ChatRoomAccess[]>([]);

    useEffect(() => {
        const checkAccess = async () => {
            // Initialize all rooms as accessible for viewing
            setRoomAccess(CHAT_ROOMS.map(room => ({
                room,
                hasAccess: true, // Always allow access to view rooms
                loading: false
            })));
        };

        checkAccess();
    }, [connected, publicKey, connection]);

    return (
        <div className="grid grid-cols-1 gap-4">
            {roomAccess.map(({ room, loading }) => (
                <div
                    key={room.id}
                    className={`p-4 rounded-lg border cursor-pointer 
                        ${selectedRoom?.id === room.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                    onClick={() => onSelectRoom(room)}
                >
                    <h3 className="font-bold text-lg mb-2">{room.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                    {loading ? (
                        <span className="text-sm text-gray-500">Loading...</span>
                    ) : (
                        <span className="text-sm text-green-500">Available</span>
                    )}
                </div>
            ))}
        </div>
    );
};