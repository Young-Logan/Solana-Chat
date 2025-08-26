'use client';

import { FC } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Channel, ChatRoom } from '@/config/tokens';

interface ChannelSelectorProps {
    room: ChatRoom;
    selectedChannel?: Channel;
    onSelectChannel: (channel: Channel) => void;
    hasTokens: boolean;
}

export const ChannelSelector: FC<ChannelSelectorProps> = ({
    room,
    selectedChannel,
    onSelectChannel,
    hasTokens
}) => {
    return (
        <div className="space-y-2">
            {room.channels.map((channel) => (
                <div
                    key={channel.id}
                    className={`p-3 rounded-lg ${
                        selectedChannel?.id === channel.id
                            ? 'bg-blue-100 border-blue-500'
                            : 'bg-white border-gray-200'
                    } border cursor-pointer hover:border-blue-300 transition-colors
                    ${(!hasTokens && channel.requiresToken) ? 'opacity-50' : ''}
                    `}
                    onClick={() => {
                        if (!channel.requiresToken || hasTokens) {
                            onSelectChannel(channel);
                        }
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">{channel.name}</h3>
                            <p className="text-sm text-gray-600">{channel.description}</p>
                        </div>
                        {channel.requiresToken && (
                            <div className="flex items-center">
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Token Required
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};