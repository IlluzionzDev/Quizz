import { createContext, useContext } from 'react';

type ModalContextType = { onClose: () => void };
export const ModalContext = createContext<ModalContextType>({ onClose: () => {} });
export const useModal = () => useContext(ModalContext);