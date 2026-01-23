 # Introduction

 https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/create-an-app-from-scratch

# Run

 - npm run dev
 - Open Local Play Url

# Theme System

This app includes a dynamic theme system with five themes:

## Available Themes

1. **Space Theme** 🚀
   - Futuristic spaceship control panel design
   - Neon blue/cyan colors with glowing effects
   - Star field background with animated planets
   - Orbitron font

2. **Comic Theme** 💥
   - Bold comic book style with halftone effects
   - Bright, vibrant colors (yellow, orange, pink, purple)
   - Bold black borders and comic-style text
   - Bangers and Permanent Marker fonts

3. **Cyberpunk Theme** 🌃
   - Dark neon cyberpunk aesthetic
   - Cyan and magenta glowing effects
   - Grid background with perspective
   - Share Tech Mono font

4. **SAP Theme** 💼
   - Professional SAP Fiori-inspired design
   - Clean corporate look with SAP Blue (#0a6ed1)
   - Subtle grid pattern and professional shadows
   - 72 and Open Sans fonts

5. **Modern Theme** ✨
   - Contemporary minimalist design
   - Soft gradients with glassmorphism effects
   - Purple/indigo accents with clean typography
   - Inter font with smooth transitions

## How to Use

The theme selector appears at the top of the app. Click any theme button to instantly switch themes. Your selection is saved in localStorage and persists across sessions.

## Implementation

- **ThemeContext**: Manages the current theme state
- **ThemeProvider**: Wraps the app and provides theme context
- **ThemeSelector**: Component that displays theme selection buttons
- Individual CSS files for each theme in `/src/themes/`
