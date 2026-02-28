import React from 'react';
import { Header } from './Header';
import { ToastContainer } from './ToastContainer';

// Memoized Header component - simplified since no props needed
export const MemoizedHeader = React.memo(Header);

MemoizedHeader.displayName = 'MemoizedHeader';

// ToastContainer component (no memoization needed since it uses internal state)
export const MemoizedToastContainer = ToastContainer;

MemoizedToastContainer.displayName = 'ToastContainer';
