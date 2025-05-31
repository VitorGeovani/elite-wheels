import con from "./connection.js"

export async function inserir(veiculo) {
  let comando = `
      insert into tb_veiculo (id_tipo_veiculo, ds_modelo, ds_marca, nr_ano, ds_placa) 
                      values (?, ?, ?, ?, ?)
  `

  let [resp] = await con.query(comando,
    [
      veiculo.idTipoVeiculo,
      veiculo.modelo,
      veiculo.marca,
      veiculo.ano,
      veiculo.placa
    ])
  
  veiculo.id = resp.insertId;
  return veiculo;
}

export async function consultar(busca) {
  let comando = `
      select ve.id_veiculo       as id_veiculo,
             tv.id_tipo_veiculo  as id_tipo_veiculo,
             tv.ds_tipo          as ds_tipo,
             ve.ds_modelo        as ds_modelo,
             ve.ds_marca         as ds_marca,
             ve.nr_ano           as nr_ano,
             ve.ds_placa         as ds_placa
        from tb_veiculo ve
        inner join tb_tipo_veiculo tv ON tv.id_tipo_veiculo = ve.id_tipo_veiculo
        where ve.ds_modelo like ?
           or ve.ds_marca  like ?
           or ve.ds_placa  like ?
        order by ve.id_veiculo
  `;

  let [dados] = await con.query(comando, [
    '%' + busca + '%',
    '%' + busca + '%',
    '%' + busca + '%'
  ]);
  return dados;
}

export async function alterar(id, veiculo) {
  let comando = `
      update tb_veiculo 
         set id_tipo_veiculo = ?,
             ds_modelo       = ?,
             ds_marca        = ?,
             nr_ano          = ?,
             ds_placa        = ?
       where id_veiculo      = ?
  `

  let [resp] = await con.query(comando, 
    [
      veiculo.idTipoVeiculo,
      veiculo.modelo,
      veiculo.marca,
      veiculo.ano,
      veiculo.placa,
      id
    ])
  
  return resp.affectedRows;
}

export async function deletar(id) {
  let comando = `
      delete from tb_veiculo 
            where id_veiculo = ?
  `

  let [resp] = await con.query(comando, [id]);
  return resp.affectedRows;
}

// Buscar veículos disponíveis (não estão em locação pendente)
export async function listarVeiculosDisponiveis() {
  const comando = `
    SELECT ve.id_veiculo,
           ve.ds_modelo,
           ve.ds_marca, 
           ve.nr_ano,
           ve.ds_placa,
           tv.ds_tipo
      FROM tb_veiculo ve
      INNER JOIN tb_tipo_veiculo tv ON ve.id_tipo_veiculo = tv.id_tipo_veiculo
     WHERE ve.id_veiculo NOT IN (
        SELECT l.id_veiculo
          FROM tb_locacao l
         WHERE l.ds_situacao = 'pendente'
     )
     ORDER BY ve.ds_modelo
  `;
  const [linhas] = await con.query(comando);
  return linhas;
}