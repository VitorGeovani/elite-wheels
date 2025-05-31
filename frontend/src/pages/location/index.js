import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AccountBar from '../components/accountBar/accountBar';
import LateralMenu from '../components/menuComponent/menu';
import './index.scss';

export default function Location() {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [veiculosDisponiveis, setVeiculosDisponiveis] = useState([]);
    const [locacoes, setLocacoes] = useState([]);
    const [situacao, setSituacao] = useState('pendente');
    const [idCliente, setIdCliente] = useState('');
    const [idVeiculo, setIdVeiculo] = useState('');
    const [dataLocacao, setDataLocacao] = useState('');
    const [km, setKm] = useState('');
    const [seguro, setSeguro] = useState(false);
    const [observacao, setObservacao] = useState('');
    const [erro, setErro] = useState('');
    const [busca, setBusca] = useState('');
    const [editando, setEditando] = useState(null);

    // Cria uma lista que une os disponíveis + o veículo da edição (se não estiver incluso)
    const veiculosSelect = editando
        ? [
            ...veiculosDisponiveis,
            ...veiculos.filter(v => v.id_veiculo === Number(idVeiculo) && !veiculosDisponiveis.some(d => d.id_veiculo === v.id_veiculo))
        ]
        : veiculosDisponiveis;

    useEffect(() => {
        async function carregar() {
            try {
                let r1 = await axios.get('http://localhost:5000/cliente');
                setClientes(r1.data);
                let r2 = await axios.get('http://localhost:5000/veiculo');
                setVeiculos(r2.data);
                let r3 = await axios.get('http://localhost:5000/locacao');
                setLocacoes(r3.data);
                let r4 = await axios.get('http://localhost:5000/veiculo/disponiveis');
                setVeiculosDisponiveis(r4.data);

            } catch (err) {
                setErro('Erro ao carregar dados');
            }
        }
        carregar();
    }, []);

    async function salvar() {
        try {
            if (editando) {
                // Editar locação existente
                await axios.put(`http://localhost:5000/locacao/${editando}`, {
                    idCliente,
                    idVeiculo,
                    dataLocacao,
                    km,
                    seguro,
                    observacao
                });
                alert('Locação editada com sucesso!');
                let r4 = await axios.get('http://localhost:5000/veiculo/disponiveis');
                setVeiculosDisponiveis(r4.data);
            } else {
                // Nova locação
                await axios.post('http://localhost:5000/locacao', {
                    idCliente,
                    idVeiculo,
                    dataLocacao,
                    km,
                    seguro,
                    observacao,
                    situacao
                });
                alert('Locação cadastrada com sucesso!');
                let r4 = await axios.get('http://localhost:5000/veiculo/disponiveis');
                setVeiculosDisponiveis(r4.data);
            }
            setIdCliente('');
            setIdVeiculo('');
            setDataLocacao('');
            setKm('');
            setSeguro(false);
            setObservacao('');
            setErro('');
            setEditando(null);
            let r3 = await axios.get('http://localhost:5000/locacao');
            setLocacoes(r3.data);
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao salvar locação');
        }
    }

    async function excluir(id) {
        if (window.confirm('Deseja realmente excluir esta locação?')) {
            try {
                await axios.delete('http://localhost:5000/locacao/' + id);
                setLocacoes(locacoes.filter(l => l.id_locacao !== id));
                alert('Locação excluída com sucesso!');
                let r4 = await axios.get('http://localhost:5000/veiculo/disponiveis');
                setVeiculosDisponiveis(r4.data);
            } catch (err) {
                setErro('Erro ao excluir locação');
            }
        }
    }

    function editar(locacao) {
        setEditando(locacao.id_locacao);
        setIdCliente(locacao.id_cliente || '');
        setIdVeiculo(locacao.id_veiculo || '');
        setDataLocacao(locacao.dt_locacao ? locacao.dt_locacao.substring(0, 10) : '');
        setKm(locacao.nr_km_retirada || '');
        setSeguro(locacao.bt_seguro || false);
        setObservacao(locacao.ds_observacao || '');
        setErro('');
    }

    function cancelarEdicao() {
        setEditando(null);
        setIdCliente('');
        setIdVeiculo('');
        setDataLocacao('');
        setKm('');
        setSeguro(false);
        setObservacao('');
        setErro('');
    }

    function concluirEntrega(idLocacao) {
        navigate(`/entrega/${idLocacao}`);
    }

    // Filtro de busca por nome/cpf
    const locacoesFiltradas = locacoes.filter(l =>
        (l.nm_cliente && l.nm_cliente.toLowerCase().includes(busca.toLowerCase())) ||
        (l.ds_cpf && l.ds_cpf.includes(busca))
    );

    function formatarDataBR(dataISO) {
        if (!dataISO) return '';
        const data = new Date(dataISO);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    return (
        <div className="MainLocation">
            <LateralMenu />
            <div className='LocationInsert'>
                <AccountBar />
                <div className='content'>
                    <div className='Title'>
                        <h4>ÁREA ADMINISTRATIVA</h4>
                        <h1>Controle de Locação</h1>
                    </div>
                    <section className='newLocation'>
                        <h1>{editando ? 'Editar Locação' : 'Nova Locação'}</h1>
                        <h2>{erro}</h2>
                        <div className='locationArrowInputs'>
                            <span>
                                <label>Cliente</label>
                                <select value={idCliente} onChange={e => setIdCliente(e.target.value)}>
                                    <option value="">Selecione</option>
                                    {clientes.map(c => (
                                        <option key={c.id} value={c.id}>{c.nome}, {c.cpf}</option>
                                    ))}
                                </select>
                            </span>
                            <div className='icons'>
                                <i className="fa-solid fa-chevron-right"></i>
                                <i className="fa-solid fa-chevron-right"></i>
                            </div>
                            <span>
                                <label>Veículo</label>
                                <select value={idVeiculo} onChange={e => setIdVeiculo(e.target.value)}>
                                    <option value="">Selecione</option>
                                    {veiculosSelect.map(v => (
                                        <option key={v.id_veiculo} value={v.id_veiculo}>
                                            {v.ds_modelo}, {v.nr_ano}, {v.ds_placa}
                                        </option>
                                    ))}
                                </select>
                            </span>
                        </div>
                        <div>
                            <div className='inputs2'>
                                <span>
                                    <label>Data da Locação</label>
                                    <input type='date' value={dataLocacao} onChange={e => setDataLocacao(e.target.value)} />
                                </span>
                                <span>
                                    <label>KM atual</label>
                                    <input type='text' value={km} onChange={e => setKm(e.target.value)} />
                                </span>
                                <label>
                                    <input type='checkbox' checked={seguro} onChange={e => setSeguro(e.target.checked)} />
                                    <a>Seguro</a>
                                </label>
                            </div>
                            <span className='textarea'>
                                <label>Observações</label>
                                <textarea value={observacao} onChange={e => setObservacao(e.target.value)} />
                            </span>
                        </div>
                        <span className='btnSpan'>
                            <button onClick={salvar}>{editando ? 'Salvar Edição' : 'Salvar'}</button>
                            {editando && <button onClick={cancelarEdicao} style={{ marginLeft: 10, background: '#aaa' }}>Cancelar</button>}
                        </span>
                    </section>
                    <section className='ClientsList'>
                        <h1> Locações em Andamento </h1>
                        <span className='inputNameSearch'>
                            <label>Nome ou CPF</label>
                            <input type='text' value={busca} onChange={e => setBusca(e.target.value)} />
                        </span>
                        <table>
                            <colgroup>
                                <col style={{ width: '20%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '20%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '15%' }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>CPF</th>
                                    <th>Veiculo</th>
                                    <th>Data de Locação</th>
                                    <th>Ações</th>
                                    <th>Entrega</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locacoesFiltradas.map(l => (
                                    <tr key={l.id_locacao}>
                                        <td>{l.nm_cliente}</td>
                                        <td>{l.ds_cpf}</td>
                                        <td>{l.ds_modelo} ({l.ds_placa})</td>
                                        <td>{formatarDataBR(l.dt_locacao)}</td>
                                        <td>
                                            <i className="fa-regular fa-pen-to-square" style={{ marginLeft: 10, cursor: 'pointer' }} onClick={() => editar(l)} title="Editar"></i>
                                            <i className="fa-solid fa-delete-left" style={{ marginLeft: 10, cursor: 'pointer' }} onClick={() => excluir(l.id_locacao)} title="Excluir"></i>
                                        </td>
                                        <td>
                                            <button onClick={() => concluirEntrega(l.id_locacao)}>CONCLUIR</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
        </div>
    );
}