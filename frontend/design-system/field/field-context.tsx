import { createContext, useContext } from 'react';

type FieldContextType = {
    error: string | undefined;
    name: string;
    id: string;
};

// Expose field variables
export const FieldContext = createContext<FieldContextType>({ error: undefined, name: '', id: '' });
export const useField = () => useContext(FieldContext);
