import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './index.scss';
import LateralMenu from '../components/menuComponent/menu';
import AccountBar from '../components/accountBar/accountBar';

export default function EntregaVeiculo() {
    const navigate = useNavigate();
    const [locacao, setLocacao] = useState(null);
    const [dataEntrega, setDataEntrega] = useState('');
    const [kmEntrega, setKmEntrega] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [erro, setErro] = useState('');
    const { idLocacao } = useParams();


    useEffect(() => {
        async function carregarLocacao() {
            try {
                const resp = await axios.get(`http://localhost:5000/locacao/${idLocacao}`);
                setLocacao(resp.data);
            } catch (err) {
                setErro('Locação não encontrada');
            }
        }
        carregarLocacao();
    }, [idLocacao]);

    if (!locacao) {
        return <div>Locação não encontrada</div>
    }

    async function salvarEntrega() {
        // Validação: data de entrega não pode ser antes da data de retirada
        if (new Date(dataEntrega) < new Date(locacao.dt_locacao)) {
            setErro('A data de entrega não pode ser anterior à data de retirada.');
            return;
        }

        // Validação: KM de entrega não pode ser menor que o KM de retirada
        if (Number(kmEntrega) < Number(locacao.nr_km_retirada)) {
            setErro('O KM de entrega não pode ser menor que o KM de retirada.');
            return;
        }
        try {
            await axios.put(`http://localhost:5000/locacao/entrega/${locacao.id_locacao}`, {
                dataEntrega,
                kmEntrega,
                valorTotal: calcularTotal()
            });
            alert('Entrega finalizada com sucesso!');
            navigate('/location');
        }
        catch (err) {
            setErro(err.response.data.erro);
        }
    }


    function formatarDataBR(dataISO) {
        if (!dataISO) return '';
        const data = new Date(dataISO);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    function calcularDiasLocacao(dataInicio, dataFim) {
        if (!dataInicio || !dataFim) return 0;
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        // Zera o horário para evitar problemas de fuso
        inicio.setHours(0, 0, 0, 0);
        fim.setHours(0, 0, 0, 0);
        const diffMs = fim - inicio;
        const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return diffDias > 0 ? diffDias : 1; // mínimo 1 dia
    }

    function calcularTotal() {
        const dias = calcularDiasLocacao(locacao.dt_locacao, dataEntrega);
        return dias * 100;
    }


    return (
        <div className="MainLocation">
            <LateralMenu />
            <div className='LocationInsert'>
                <AccountBar />
                <div className='content'>
                    <div className='Title'>
                        <h4>ÁREA ADMINISTRATIVA</h4>
                        <h1>Entrega de Veículo</h1>
                    </div>

                    <div className='entrega-container'>
                        <section className='info-locacao'>
                            <div className='info-item'>
                                <span>Cliente:</span>
                                <p>{locacao.nm_cliente}, {locacao.ds_cpf}</p>
                            </div>
                            <div className='info-item'>
                                <span>Veículo:</span>
                                <p>{locacao.ds_modelo} ({locacao.ds_placa})</p>
                            </div>

                            <div className='info-item'>
                                <span>Data da Locação:</span>
                                <p>{formatarDataBR(locacao.dt_locacao)}</p>
                            </div>
                            <div className='info-item'>
                                <span>km retirada</span>
                                <p>{locacao.nr_km_retirada}</p>
                            </div>
                            <div className='info-item'>
                                <span>Seguro:</span>
                                <p>{locacao.bt_seguro ? 'Sim' : 'Não'}</p>
                            </div>
                        </section>

                        <section className='finalizar-locacao'>
                            <h2>Finalizar Locação</h2>
                            {erro && <div className='erro'>{erro}</div>}

                            <div className='input-group'>
                                <label>Data de Entrega</label>
                                <input
                                    type="date"
                                    value={dataEntrega}
                                    onChange={e => setDataEntrega(e.target.value)}
                                />
                            </div>

                            <div className='input-group'>
                                <label>KM Entrega</label>
                                <input
                                    type="text"
                                    value={kmEntrega}
                                    onChange={e => setKmEntrega(e.target.value)}
                                />
                            </div>

                            <div className='input-group'>
                                <label>Dias de Locação</label>
                                <input
                                    type="text"
                                    value={calcularDiasLocacao(locacao.dt_locacao, dataEntrega)}
                                    readOnly
                                />
                            </div>

                            <div className='total'>
                                <span>TOTAL</span>
                                <h3>R$ {calcularTotal().toFixed(2)}</h3>
                            </div>

                            <div className='input-group'>
                                <label>Observações</label>
                                <textarea
                                    value={observacoes}
                                    onChange={e => setObservacoes(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <button onClick={salvarEntrega}>
                                SALVAR LOCAÇÃO
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}