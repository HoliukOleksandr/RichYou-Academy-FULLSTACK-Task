import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Імпорт useTheme

const Topbar: React.FC = () => {
    const { isDarkTheme, toggleTheme } = useTheme();

    return (
        <div className="topbar">
            <input type="text" placeholder="Пошук..." />
            <button onClick={toggleTheme}>{isDarkTheme ? 'Світла тема' : 'Темна тема'}</button>
        </div>
    );
};

export default Topbar;