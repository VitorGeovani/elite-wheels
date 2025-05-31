import { useAuth } from '../context/AuthContext';
import Login from '../pages/login';

export default function ProtectedRoute({ children }) {
    const { usuario, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <div>Carregando...</div>
            </div>
        );
    }

    if (!usuario) {
        return <Login />;
    }

    return children;
}