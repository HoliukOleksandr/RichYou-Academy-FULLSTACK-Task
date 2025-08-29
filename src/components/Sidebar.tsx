import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
    const { logout } = useAuth();

    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/todo">Завдання</Link></li>
                <li><Link to="/analytics">Аналітика</Link></li>
                <li><Link to="/people">Люди</Link></li>
                <li><Link to="/products">Товари</Link></li>
                <li><Link to="/settings">Налаштування</Link></li>
                <li><button onClick={logout}>Вийти</button></li>
            </ul>
        </div>
    );
};

export default Sidebar;