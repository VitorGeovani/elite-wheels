import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            verificarToken();
        } else {
            setLoading(false);
        }
    }, []);

    async function verificarToken() {
        try {
            const response = await axios.get('http://localhost:5000/verify');
            setUsuario(response.data.usuario);
        } catch (err) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    }

    async function login(email, senha) {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                email,
                senha
            });

            const { token, usuario } = response.data;
            
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUsuario(usuario);
            
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.erro || 'Erro ao fazer login' 
            };
        }
    }

    function logout() {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUsuario(null);
    }

    const value = {
        usuario,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}