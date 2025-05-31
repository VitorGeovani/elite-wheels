import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import logo from '../../assets/logo.png';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setCarregando(true);
        setErro('');

        const resultado = await login(email, senha);
        
        if (resultado.success) {
            navigate('/');
        } else {
            setErro(resultado.error);
        }
        
        setCarregando(false);
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <img src={logo} alt="EliteWheels" />
                    <h1>Elite<span>Wheels</span></h1>
                    <h2>Sistema de Locadora</h2>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <h3>Fazer Login</h3>
                    
                    {erro && <div className="erro">{erro}</div>}
                    
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Digite seu email"
                        />
                    </div>

                    <div className="input-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            placeholder="Digite sua senha"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={carregando}
                        className="login-btn"
                    >
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="login-info">
                    <p><strong>Dados de acesso padrão:</strong></p>
                    <p>Email: admin@elitewheels.com</p>
                    <p>Senha: admin123</p>
                </div>
            </div>
        </div>
    );
}