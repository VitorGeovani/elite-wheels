import con from "./connection.js";
import bcrypt from 'bcrypt';

export async function buscarUsuarioPorEmail(email) {
    const comando = `
        SELECT id_usuario as id,
               nm_usuario as nome,
               ds_email as email,
               ds_senha as senha,
               bt_ativo as ativo
        FROM tb_usuario
        WHERE ds_email = ? AND bt_ativo = true
    `;
    
    const [dados] = await con.query(comando, [email]);
    return dados[0];
}

export async function criarUsuario(usuario) {
    const senhaHash = await bcrypt.hash(usuario.senha, 10);
    
    const comando = `
        INSERT INTO tb_usuario (nm_usuario, ds_email, ds_senha)
        VALUES (?, ?, ?)
    `;
    
    const [resp] = await con.query(comando, [
        usuario.nome,
        usuario.email,
        senhaHash
    ]);
    
    return { id: resp.insertId, ...usuario };
}

export async function verificarSenha(senhaPlana, senhaHash) {
    return await bcrypt.compare(senhaPlana, senhaHash);
}