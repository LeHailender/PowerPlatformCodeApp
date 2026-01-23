import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ThemeName = 'space' | 'comic' | 'cyberpunk' | 'sap' | 'modern';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as ThemeName) || 'modern';
  });

  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove('theme-space', 'theme-comic', 'theme-cyberpunk');
    // Add current theme class
    document.body.classList.add(`theme-${theme}`);
    // Save to localStorage
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
