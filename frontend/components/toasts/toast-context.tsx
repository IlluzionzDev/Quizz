import { createContext } from 'react';
import { ToastData } from './toast-provider';

export type ToastContextState = {
    open: (data: ToastData) => string;
    close: (id: string) => void;
    closeAll: () => void;
};

export const ToastContext = createContext<ToastContextState>({
    open: (data: ToastData): string => {
        return '';
    }, // Open a new toast
    close: (id: string) => {}, // Close a certain toast
    closeAll: () => {} // Close all toasts
});
