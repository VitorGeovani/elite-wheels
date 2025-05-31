import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { buscarUsuarioPorEmail, verificarSenha, criarUsuario } from '../repository/usuarioRepository.js';

const endpoints = Router();

// Login
endpoints.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        console.log('Tentativa de login:', { email, senha: '***' });

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        }

        const usuario = await buscarUsuarioPorEmail(email);
        console.log('Usuário encontrado:', usuario ? 'Sim' : 'Não');
        
        if (!usuario) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }

        const senhaValida = await verificarSenha(senha, usuario.senha);
        console.log('Senha válida:', senhaValida);
        
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }

        const token = jwt.sign(
            { 
                id: usuario.id, 
                email: usuario.email,
                nome: usuario.nome 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login realizado com sucesso para:', usuario.email);

        res.json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ erro: err.message });
    }
});

// Registro (caso queira permitir novos usuários)
endpoints.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
        }

        const usuarioExistente = await buscarUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        const novoUsuario = await criarUsuario({ nome, email, senha });
        res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Verificar token
endpoints.get('/verify', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ erro: 'Token inválido' });
        }
        res.json({ usuario: user });
    });
});

export default endpoints;