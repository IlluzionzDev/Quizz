import { PropsWithChildren, useContext, useMemo, useState } from 'react';
import { ToastContext } from './toast-context';
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

export const ToastProvider: React.FC<PropsWithChildren> = ({ children }) => {
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
        console.log('Removing toast with id: ', id);

        console.log('Old Toasts State: ', toasts);
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id != id));

        console.log('New Toasts State: ', toasts);
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
