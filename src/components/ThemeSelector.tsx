import { useTheme, type ThemeName } from '../contexts/ThemeContext';
import './ThemeSelector.css';

const themes: { name: ThemeName; label: string; icon: string }[] = [
  { name: 'modern', label: 'Modern', icon: '✨' },
  { name: 'space', label: 'Space', icon: '🚀' },
  { name: 'comic', label: 'Comic', icon: '💥' },
  { name: 'cyberpunk', label: 'Cyberpunk', icon: '🌃' },
  { name: 'sap', label: 'SAP', icon: '💼' },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-selector">
      <label className="theme-selector-label">Theme:</label>
      <div className="theme-buttons">
        {themes.map((t) => (
          <button
            key={t.name}
            className={`theme-btn ${theme === t.name ? 'active' : ''}`}
            onClick={() => setTheme(t.name)}
            title={`Switch to ${t.label} theme`}
          >
            <span className="theme-icon">{t.icon}</span>
            <span className="theme-name">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
