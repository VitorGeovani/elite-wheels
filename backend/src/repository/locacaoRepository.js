import con from "./connection.js";

export async function inserirLocacao(locacao) {
  let comando = `
    INSERT INTO tb_locacao (id_cliente, id_veiculo, dt_locacao, nr_km_retirada, bt_seguro, ds_observacao, ds_situacao)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  let [resp] = await con.query(comando, [
    locacao.idCliente,
    locacao.idVeiculo,
    locacao.dataLocacao,
    locacao.km,
    locacao.seguro,
    locacao.observacao,
    locacao.situacao
  ]);

  return { id: resp.insertId, ...locacao };
}

export async function listarLocacoes() {
  let comando = `
    select l.id_locacao,
           l.id_cliente,
           l.id_veiculo,
           l.dt_locacao,
           l.nr_km_retirada,
           l.bt_seguro,
           l.ds_observacao,
           l.ds_situacao,
           c.nm_cliente,
           c.ds_cpf,
           v.ds_modelo,
           v.ds_placa
      from tb_locacao l
      inner join tb_cliente c on l.id_cliente = c.id_cliente
      inner join tb_veiculo v on l.id_veiculo = v.id_veiculo
     where l.ds_situacao = 'pendente'
     order by l.dt_locacao desc
  `;
  let [dados] = await con.query(comando);
  return dados;
}

export async function listarTodasLocacoes() {
  let comando = `
    select l.id_locacao,
           l.id_cliente,
           l.id_veiculo,
           l.dt_locacao,
           l.dt_entrega,
           l.nr_km_retirada,
           l.nr_km_entrega,
           l.bt_seguro,
           l.ds_observacao,
           l.ds_situacao,
           l.vl_total,
           c.nm_cliente,
           c.ds_cpf,
           v.ds_modelo,
           v.ds_placa
      from tb_locacao l
      inner join tb_cliente c on l.id_cliente = c.id_cliente
      inner join tb_veiculo v on l.id_veiculo = v.id_veiculo
      order by l.id_locacao desc
  `;
  let [dados] = await con.query(comando);
  return dados;
}

export async function alterarLocacao(id, locacao) {
  try {
    let comando = `
      UPDATE tb_locacao
         SET id_cliente = ?,
             id_veiculo = ?,
             dt_locacao = ?,
             nr_km_retirada = ?,
             bt_seguro = ?,
             ds_observacao = ?
       WHERE id_locacao = ?
    `;

    let [resp] = await con.query(comando, [
      locacao.idCliente,
      locacao.idVeiculo,
      locacao.dataLocacao,
      locacao.km,
      locacao.seguro,
      locacao.observacao,
      id
    ]);

    return resp.affectedRows;
  }
  catch (err) {
    console.error('Erro ao alterar locação:', err);
    throw err;
  }
}

export async function deletarLocacao(id) {
  let comando = `delete from tb_locacao where id_locacao = ?`;
  let [resp] = await con.query(comando, [id]);
  return resp.affectedRows;
}

export async function buscarLocacaoPorId(id) {
  let comando = `
    select l.id_locacao,
           l.id_cliente,
           l.id_veiculo,
           l.dt_locacao,
           l.nr_km_retirada,
           l.bt_seguro,
           l.ds_observacao,
           l.ds_situacao,
           c.nm_cliente,
           c.ds_cpf,
           v.ds_modelo,
           v.ds_placa
      from tb_locacao l
      inner join tb_cliente c on l.id_cliente = c.id_cliente
      inner join tb_veiculo v on l.id_veiculo = v.id_veiculo
     where l.id_locacao = ?
  `;
  let [dados] = await con.query(comando, [id]);
  return dados[0];
}

export async function concluirEntregaLocacao(id, entrega) {
  let comando = `
    UPDATE tb_locacao
       SET dt_entrega = ?,
           nr_km_entrega = ?,
           vl_total = ?,
           ds_situacao = 'concluido'
     WHERE id_locacao = ?
  `;
  let [resp] = await con.query(comando, [
    entrega.dataEntrega,
    entrega.kmEntrega,
    entrega.valorTotal,
    id
  ]);
  return resp.affectedRows;
}