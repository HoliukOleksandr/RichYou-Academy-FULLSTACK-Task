import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // Додано імпорт ThemeProvider
import './styles/main.scss'; // Ваш файл стилів

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <BrowserRouter>
        <AuthProvider>
            <ThemeProvider> {/* Обгортаємо в ThemeProvider */}
                <App />
            </ThemeProvider>
        </AuthProvider>
    </BrowserRouter>
);