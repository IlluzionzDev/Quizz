import { useContext, useMemo, useState } from 'react';
import { ToastContext } from './toast-context';
import { Box, Flex, Portal } from '@illuzionz-studios/design-system';
import { Toast } from './toast';
import styles from './toasts.module.scss';
import { createPortal } from 'react-dom';
import { ToastContainer } from './toast-container';

export interface ToastData {
    id?: string;
    title: string;
    content: string;
    color: string;
    backgroundColor: string;
}

export const generateRandomId = (length: number) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const ToastProvider: React.FC = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const open = (data: ToastData): string => {
        let id = generateRandomId(5);

        setToasts((current) => [
            ...current,
            {
                ...data,
                id
            }
        ]);

        setTimeout(() => {
            close(id);
        }, 5000);

        return id;
    };

    const close = (id: string) => {
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    };

    const closeAll = () => {
        setToasts([]);
    };

    const contextValue = useMemo(() => ({ open, close, closeAll }), []);

    return (
        <ToastContext.Provider value={contextValue}>
            <ToastContainer data={toasts} />
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
