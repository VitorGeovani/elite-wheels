import bcrypt from 'bcrypt';
import mysql2 from 'mysql2/promise';
import 'dotenv/config';

async function criarUsuarioAdmin() {
    try {
        const con = await mysql2.createConnection({
            host: process.env.HOST,
            database: process.env.DB,
            user: process.env.USER,
            password: process.env.PWD,
        });

        // Criar hash da senha
        const senhaHash = await bcrypt.hash('admin123', 10);
        
        // Verificar se usuário já existe
        const [existente] = await con.query(
            'SELECT * FROM tb_usuario WHERE ds_email = ?', 
            ['admin@elitewheels.com']
        );

        if (existente.length > 0) {
            // Atualizar senha
            await con.query(
                'UPDATE tb_usuario SET ds_senha = ? WHERE ds_email = ?',
                [senhaHash, 'admin@elitewheels.com']
            );
            console.log('Senha do usuário admin atualizada!');
        } else {
            // Inserir novo usuário
            await con.query(
                'INSERT INTO tb_usuario (nm_usuario, ds_email, ds_senha) VALUES (?, ?, ?)',
                ['Administrador', 'admin@elitewheels.com', senhaHash]
            );
            console.log('Usuário admin criado!');
        }

        await con.end();
        
        // Verificar se foi criado corretamente
        console.log('Hash gerado:', senhaHash);
        console.log('Teste da senha:', await bcrypt.compare('admin123', senhaHash));
        
    } catch (error) {
        console.error('Erro:', error);
    }
}

criarUsuarioAdmin();