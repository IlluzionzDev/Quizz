import React, { createContext, useContext, useState } from 'react';
import { darkTheme } from './dark-theme';
import { lightTheme } from './light-theme';

// Theme object
export const ThemeContext = createContext({
    isDarkTheme: false,
    toggleTheme: () => {}
});

export const ThemeProvider: React.FC = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const toggleTheme = (): void => {
        setIsDarkTheme(!isDarkTheme);
    };

    return <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// Use theme constants
export function useTheme() {
	const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

	const theme = isDarkTheme ? darkTheme : lightTheme;
	return { theme, toggleTheme };
}
