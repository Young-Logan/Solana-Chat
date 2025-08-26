'use client';

import { FC, ReactNode, useMemo } from 'react';
import dynamic from 'next/dynamic';

const WalletConnectionProvider = dynamic(
  () => import('./WalletConnectionProvider'),
  { ssr: false }
);

interface Props {
  children: ReactNode;
}

export const WalletContextProvider: FC<Props> = ({ children }) => {
  return <WalletConnectionProvider>{children}</WalletConnectionProvider>;
};