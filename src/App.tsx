import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import ToDo from './components/ToDoManager';
import Analytics from './components/Analytics';
import People from './components/People';
import Products from './components/Products';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

const App: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="app">
            {isAuthenticated && (
                <>
                    <Sidebar />
                    <Topbar />
                </>
            )}
            <main className={isAuthenticated ? 'main-content' : ''}>
                <Routes>
                    <Route
                        path="/login"
                        element={!isAuthenticated ? <Login /> : <Navigate to="/todo" />}
                    />
                    <Route
                        path="/todo"
                        element={isAuthenticated ? <ToDo /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/analytics"
                        element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/people"
                        element={isAuthenticated ? <People /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/products"
                        element={isAuthenticated ? <Products /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/settings"
                        element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;