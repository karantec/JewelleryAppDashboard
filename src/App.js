import React, { lazy, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { themeChange } from 'theme-change';

import initializeApp from './app/init';
import { AuthProvider } from './app/AuthContext';
import PrivateRoute from './app/PrivateRoute';

const Layout = lazy(() => import('./containers/Layout'));
const Login = lazy(() => import('./pages/Login'));

initializeApp();

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        themeChange(false);

        setTimeout(() => {
            setLoading(false);
        }, 500); // Simulate loading delay
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    
                    
                    <Route
                        path="/app/*"
                        element={
                            <PrivateRoute>
                                <Layout />
                            </PrivateRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
