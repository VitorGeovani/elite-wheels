import { useAuth } from '../../../context/AuthContext';
import './accountBar.scss';

export default function AccountBar() {
    const { usuario, logout } = useAuth();

    function handleLogout() {
        if (window.confirm('Deseja realmente sair do sistema?')) {
            logout();
        }
    }

    return (
        <header>
            <h4>Olá {usuario?.nome}, que bom que você voltou!</h4>
            <div className="user-actions">
                <span className="user-email">{usuario?.email}</span>
                <button onClick={handleLogout} className="logout-btn">
                    <i className="fa-solid fa-sign-out-alt"></i>
                    Sair
                </button>
            </div>
        </header>
    );
}