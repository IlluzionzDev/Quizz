import { IconButton } from '@design-system/button';
import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { darkTheme } from './dark-theme';
import { lightTheme } from './light-theme';

const defaultTheme = {
	color: 'string'
}

export type Theme = typeof defaultTheme;

// Theme object
export const ThemeContext = createContext({
    isDarkTheme: false,
    toggleTheme: () => {}
});

export const ThemeProvider: React.FC = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const toggleTheme = (): void => {
        setIsDarkTheme((prev) => !prev);
    };

	// Update body theme class
	useEffect(() => {
		 if (isDarkTheme) {
             document.body.classList.add('darkTheme');
         } else {
             document.body.classList.remove('darkTheme');
         }
	}, [isDarkTheme]);

    return <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const ThemeSwitcher = () => {
    const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

    return <IconButton onClick={toggleTheme} icon={(isDarkTheme ? <FaSun /> : <FaMoon />)}/>
}

// Use theme constants
export function useTheme() {
    const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

    const theme = isDarkTheme ? darkTheme : lightTheme;
    return { theme, toggleTheme };
}
