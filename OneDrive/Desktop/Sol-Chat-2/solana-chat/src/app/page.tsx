'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ChatRoom, Channel } from '@/config/tokens';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

// Dynamically import components
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const ChatRoomSelector = dynamic(
  () => import('@/components/ChatRoomSelector').then(mod => mod.ChatRoomSelector),
  { ssr: false }
);

const Chat = dynamic(
  () => import('@/components/Chat').then(mod => mod.Chat),
  { ssr: false }
);

const ChannelSelector = dynamic(
  () => import('@/components/ChannelSelector').then(mod => mod.ChannelSelector),
  { ssr: false }
);

export default function Home() {
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | undefined>();
  const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>();
  const [hasTokens, setHasTokens] = useState(false);

  useEffect(() => {
    const checkTokenBalance = async () => {
      if (!connected || !publicKey || !selectedRoom) {
        setHasTokens(false);
        return;
      }

      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID }
        );

        const tokenAccount = tokenAccounts.value.find(
          (account) => account.account.data.parsed.info.mint === selectedRoom.tokenMint
        );

        if (tokenAccount) {
          const balance = Number(tokenAccount.account.data.parsed.info.tokenAmount.amount);
          setHasTokens(balance >= selectedRoom.minTokens);
        } else {
          setHasTokens(false);
        }
      } catch (error) {
        console.error('Error checking token balance:', error);
        setHasTokens(false);
      }
    };

    checkTokenBalance();
  }, [connected, publicKey, selectedRoom, connection]);

  // Reset channel when changing rooms
  useEffect(() => {
    setSelectedChannel(undefined);
  }, [selectedRoom]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Solana Token Chat</h1>
          <div className="mb-4">
            <WalletMultiButton />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Chat Rooms</h2>
            <ChatRoomSelector 
              onSelectRoom={setSelectedRoom}
              selectedRoom={selectedRoom}
            />
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            {selectedRoom && (
              <>
                <h2 className="text-xl font-semibold mb-4">{selectedRoom.name}</h2>
                
                {/* Channel selector */}
                <div className="mb-6">
                  <ChannelSelector
                    room={selectedRoom}
                    selectedChannel={selectedChannel}
                    onSelectChannel={setSelectedChannel}
                    hasTokens={hasTokens}
                  />
                </div>

                {/* Chat area */}
                {selectedChannel && (
                  <Chat 
                    roomId={selectedRoom.id}
                    channelId={selectedChannel.id}
                    isTokenHolder={hasTokens}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}