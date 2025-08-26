'use client';

import { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

const TOKEN_MINT = new PublicKey('8eBK8oodK5d8DLHD2uXjpa2GCREEBPeCKZUiY7XcZMev');
const MIN_TOKENS_REQUIRED = 1;

export const WalletConnect: FC = () => {
    const { connection } = useConnection();
    const { connected, publicKey } = useWallet();
    const [hasAccess, setHasAccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkTokenBalance = async () => {
            if (!connected || !publicKey) {
                setHasAccess(false);
                return;
            }

            setIsLoading(true);
            try {
                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                    publicKey,
                    { programId: TOKEN_PROGRAM_ID }
                );

                const tokenAccount = tokenAccounts.value.find(
                    (account) => account.account.data.parsed.info.mint === TOKEN_MINT.toString()
                );

                if (tokenAccount) {
                    const balance = Number(tokenAccount.account.data.parsed.info.tokenAmount.amount);
                    setHasAccess(balance >= MIN_TOKENS_REQUIRED);
                } else {
                    setHasAccess(false);
                }
            } catch (error) {
                console.error('Error checking token balance:', error);
                setHasAccess(false);
            }
            setIsLoading(false);
        };

        checkTokenBalance();
    }, [connected, publicKey, connection]);

    return (
        <div className="flex flex-col items-center gap-4">
            <WalletMultiButton />
            {connected && isLoading && (
                <p className="text-gray-500">Checking token balance...</p>
            )}
            {connected && !isLoading && !hasAccess && (
                <p className="text-red-500">You need to hold at least {MIN_TOKENS_REQUIRED} token(s) to access the chat.</p>
            )}
        </div>
    );
};

export const useHasAccess = () => {
    const { connected } = useWallet();
    const [hasAccess, setHasAccess] = useState(false);
    // Add similar token checking logic here
    return hasAccess;
};