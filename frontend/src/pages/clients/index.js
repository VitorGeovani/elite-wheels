import { useState, useEffect } from 'react';
import AccountBar from '../components/accountBar/accountBar';
import LateralMenu from '../components/menuComponent/menu';
import axios from 'axios';
import './index.scss';

export default function ClientsControl() {
  // Estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnh, setCnh] = useState('');
  const [erro, setErro] = useState('');
  
  // Estados para a lista e edição
  const [listaClientes, setListaClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [idEditando, setIdEditando] = useState(null);

  // Função para buscar clientes
  async function buscarClientes() {
    try {
      const resp = await axios.get('http://localhost:5000/cliente?busca=' + busca);
      setListaClientes(resp.data);
    } catch (err) {
      setErro('Erro ao buscar clientes');
    }
  }

  // Carregar clientes ao montar o componente
  useEffect(() => {
    buscarClientes();
  }, []);

  async function salvar() {
    try {
      let cliente = {
        nome: nome,
        email: email,
        telefone: telefone,
        cpf: cpf,
        cnh: cnh
      };

      if (idEditando) {
        await axios.put(`http://localhost:5000/cliente/${idEditando}`, cliente);
        alert('Cliente alterado com sucesso!');
      } else {
        await axios.post('http://localhost:5000/cliente', cliente);
        alert('Cliente cadastrado com sucesso!');
      }

      // Limpar formulário
      limparFormulario();
      buscarClientes();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar cliente');
    }
  }

  function limparFormulario() {
    setIdEditando(null);
    setNome('');
    setEmail('');
    setTelefone('');
    setCpf('');
    setCnh('');
    setErro('');
  }

  async function excluirCliente(id) {
    if (window.confirm('Deseja realmente excluir este cliente?')) {
      try {
        await axios.delete(`http://localhost:5000/cliente/${id}`);
        buscarClientes();
        if (idEditando === id) {
          limparFormulario();
        }
      } catch (err) {
        setErro('Erro ao excluir cliente');
      }
    }
  }

  function editarCliente(cliente) {
    setIdEditando(cliente.id);
    setNome(cliente.nome);
    setEmail(cliente.email);
    setTelefone(cliente.telefone);
    setCpf(cliente.cpf);
    setCnh(cliente.cnh);
  }

  return (
    <div className="MainApp">
      <LateralMenu />
      <div className='inputs_Tables'>
        <AccountBar />
        <div className='content'>
          <div className='Title'>
            <h4>ÁREA ADMINISTRATIVA</h4>
            <h1>Controle de Clientes</h1>
          </div>

          <section className='newClient'>
            <h1>{idEditando ? 'Editar Cliente' : 'Novo Cliente'}</h1>
            <h2>{erro}</h2>
            <span>
              <label>Nome</label>
              <input type='text' value={nome} onChange={e => setNome(e.target.value)} />
            </span>
            <span>
              <label>Email</label>
              <input type='text' value={email} onChange={e => setEmail(e.target.value)} />
            </span>
            <span>
              <label>Telefone</label>
              <input type='text' maxLength={11} value={telefone} onChange={e => setTelefone(e.target.value)} />
            </span>
            <span>
              <label>CPF</label>
              <input type='text' maxLength={11} value={cpf} onChange={e => setCpf(e.target.value)} />
            </span>
            <span>
              <label>CNH</label>
              <input type='text' maxLength={11} value={cnh} onChange={e => setCnh(e.target.value)} />
            </span>
            <span className='btnSpan'>
              <button onClick={salvar}>
                {idEditando ? 'Alterar' : 'Salvar'}
              </button>
              {idEditando && 
                <button 
                  onClick={limparFormulario}
                  style={{ marginLeft: 10, background: '#aaa' }}
                >
                  Cancelar
                </button>
              }
            </span>
          </section>

          <section className='ClientsList'>
            <h1>Lista de Clientes</h1>
            <span>
              <label>Nome, Email ou CPF</label>
              <div className=''>
                <input 
                  type='text' 
                  value={busca} 
                  onChange={e => setBusca(e.target.value)} 
                />
                <i className="fa-solid fa-magnifying-glass" onClick={buscarClientes}></i>
              </div>
            </span>
            <table>
              <colgroup>
                <col style={{ width: '25%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>CPF</th>
                  <th>CNH</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {listaClientes.map(item =>
                  <tr key={item.id}>
                    <td>{item.nome}</td>
                    <td>{item.email}</td>
                    <td>{item.telefone}</td>
                    <td>{item.cpf}</td>
                    <td>{item.cnh}</td>
                    <td className='btns' style={{ display: 'flex', height: 20 }}>
                      <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => editarCliente(item)}
                        title="Editar"
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => excluirCliente(item.id)}
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
        </div>
      </div>
    </div>
  );
}