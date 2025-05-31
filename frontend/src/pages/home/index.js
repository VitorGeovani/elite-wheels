import { useState, useEffect } from 'react';
import AccountBar from '../components/accountBar/accountBar';
import LateralMenu from '../components/menuComponent/menu';
import axios from 'axios';
import './index.scss';

function App() {
  const [estatisticas, setEstatisticas] = useState({
    totalClientes: 0,
    totalVeiculos: 0,
    locacoesAtivas: 0,
    locacoesFinalizadas: 0
  });

  async function carregarEstatisticas() {
    try {
      const [clientes, veiculos, locacoes] = await Promise.all([
        axios.get('http://localhost:5000/cliente'),
        axios.get('http://localhost:5000/veiculo'),
        axios.get('http://localhost:5000/locacao/todas')
      ]);

      setEstatisticas({
        totalClientes: clientes.data.length,
        totalVeiculos: veiculos.data.length,
        locacoesAtivas: locacoes.data.filter(loc => loc.ds_situacao === 'pendente').length,
        locacoesFinalizadas: locacoes.data.filter(loc => loc.ds_situacao === 'concluido').length
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  return (
    <div className="MainApp">
      <LateralMenu />
      <div className='inputs_Tables'>
        <AccountBar/>
        <main className="home-content">
          <div className='welcome-section'>
            <h1>Bem-vindo ao Sistema de Locadora</h1>
            <p>Gerencie seus veículos, clientes e locações em um só lugar</p>
          </div>

          <div className='stats-grid'>
            <div className='stat-card'>
              <i className="fas fa-users"></i>
              <div className='stat-info'>
                <h3>Total de Clientes</h3>
                <p>{estatisticas.totalClientes}</p>
              </div>
            </div>

            <div className='stat-card'>
              <i className="fas fa-car"></i>
              <div className='stat-info'>
                <h3>Veículos Cadastrados</h3>
                <p>{estatisticas.totalVeiculos}</p>
              </div>
            </div>

            <div className='stat-card'>
              <i className="fas fa-key"></i>
              <div className='stat-info'>
                <h3>Locações Ativas</h3>
                <p>{estatisticas.locacoesAtivas}</p>
              </div>
            </div>

            <div className='stat-card'>
              <i className="fas fa-check-circle"></i>
              <div className='stat-info'>
                <h3>Locações Finalizadas</h3>
                <p>{estatisticas.locacoesFinalizadas}</p>
              </div>
            </div>
          </div>

          <div className='quick-actions'>
    <h2>Ações Rápidas</h2>
    <div className='actions-grid'>
        <button onClick={() => window.location.href = '/clients'}>
            <i className="fas fa-user-plus"></i>
            Novo Cliente
        </button>
        <button onClick={() => window.location.href = '/cars'}>
            <i className="fas fa-car-side"></i>
            Novo Veículo
        </button>
        <button onClick={() => window.location.href = '/location'}>
            <i className="fas fa-file-contract"></i>
            Nova Locação
        </button>
    </div>
</div>
        </main>
      </div>
    </div>
  );
}

export default App;