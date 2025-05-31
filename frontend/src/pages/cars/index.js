import './index.scss';
import LateralMenu from '../components/menuComponent/menu';
import AccountBar from '../components/accountBar/accountBar';
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function CarsControl() {
  const [tipos, setTipos] = useState([]);

  const [tipoSelecionado, setTipoSelecionado] = useState(0);
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [placa, setPlaca] = useState('');
  const [ano, setAno] = useState('');
  const [busca, setBusca] = useState('');
  const [listaVeiculos, setListaVeiculos] = useState([]);
  const [erro, setErro] = useState('');
  const [idEditando, setIdEditando] = useState(null);


  async function buscarVeiculos() {
    let r = await axios.get('http://localhost:5000/veiculo?busca=' + busca);
    setListaVeiculos(r.data);
  }

  async function excluirVeiculo(id) {
    if (window.confirm('Deseja realmente excluir este veículo?')) {
      await axios.delete(`http://localhost:5000/veiculo/${id}`);
      buscarVeiculos();
    }
  }

function editarVeiculo(veiculo) {
  setIdEditando(veiculo.id_veiculo);
  setTipoSelecionado(veiculo.id_tipo_veiculo);
  setModelo(veiculo.ds_modelo);
  setMarca(veiculo.ds_marca);
  setAno(veiculo.nr_ano);
  setPlaca(veiculo.ds_placa);
}


  async function salvar() {
    try {
      let veiculo = {
        idTipoVeiculo: tipoSelecionado,
        modelo: modelo,
        marca: marca,
        placa: placa,
        ano: ano
      };

      if (idEditando) {
        // Editando
        await axios.put(`http://localhost:5000/veiculo/${idEditando}`, veiculo);
        alert('Veículo alterado com sucesso!');
      } else {
        // Novo cadastro
        await axios.post('http://localhost:5000/veiculo', veiculo);
        alert('Veículo cadastrado com sucesso!');
      }

      // Limpar formulário e atualizar lista
      setIdEditando(null);
      setTipoSelecionado(0);
      setModelo('');
      setMarca('');
      setAno('');
      setPlaca('');
      setErro('');
      buscarVeiculos();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar');
    }
  }




  async function listarTipos() {
    let r = await axios.get('http://localhost:5000/veiculo/tipo');
    setTipos(r.data);
  }

  useEffect(() => {
    listarTipos();
    buscarVeiculos();
  }, [])



  return (
    <div className='CarsMain'>
      <LateralMenu />
      <div className='CarContent'>
        <AccountBar />
        <main>
          <div className='Title'>
            <h4>ÁREA ADMINISTRATIVA</h4>
            <h1>Controle de Veículos</h1>
          </div>

          <section className='newCar'>
            <h1> Novo Veículo </h1>
            <h2>{erro}</h2>
            <span >
              <label>Tipo Veículo</label>

              <select id="veiculo" name="veiculo" value={tipoSelecionado} onChange={e => setTipoSelecionado(e.target.value)} >
                <option value={0}> Selecione </option>
                {tipos.map(item =>
                  <option key={item.id} value={item.id}> {item.tipo} </option>
                )}
              </select>


            </span>


            <span >
              <label>Modelo</label>
              <input type='text' value={modelo} onChange={e => setModelo(e.target.value)} />
            </span>

            <span >
              <label>Marca</label>
              <input type='text' value={marca} onChange={e => setMarca(e.target.value)} />
            </span>

            <span >
              <label>Ano</label>
              <input type='text' value={ano} onChange={e => setAno(e.target.value)} />
            </span>

            <span >
              <label>Placa</label>
              <input type='text' value={placa} onChange={e => setPlaca(e.target.value)} />
            </span>

            <span className='btnSpan'>
              <button onClick={salvar}>{idEditando ? 'Editar' : 'Salvar'}</button>
            </span>

          </section>

          <section className='CarsList'>
            <h1>Lista de Veículos</h1>
            <span >
              <label>Modelo, Marca, Placa</label>
              <div className=''  >
                <input type='text' value={busca} onChange={e => setBusca(e.target.value)} />
                <i className="fa-solid fa-magnifying-glass" onClick={buscarVeiculos}></i>
              </div>
            </span>
            <table>
              <colgroup>
                <col style={{ width: '30%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '20%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Modelo</th>
                  <th>Marca</th>
                  <th>Ano</th>
                  <th>Tipo</th>
                  <th>placa</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {listaVeiculos.map(item =>
                  <tr key={item.id_veiculo}>
                    <td>{item.ds_modelo}</td>
                    <td>{item.ds_marca}</td>
                    <td>{item.nr_ano}</td>
                    <td>{item.ds_tipo}</td>
                    <td>{item.ds_placa}</td>
                    <td className='btns' style={{ display: 'flex', height: 20 }}>
                      <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => editarVeiculo(item)}
                        title="Editar"
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => excluirVeiculo(item.id_veiculo)}
                        title="Excluir"
                      >
                        <i className="fa-solid fa-delete-left"></i>
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </section>

        </main>

      </div>
    </div>
  );
}