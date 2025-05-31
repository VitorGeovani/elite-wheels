import { Router } from 'express';
import * as locacaoRepo from '../repository/locacaoRepository.js';
import { concluirEntregaLocacao } from '../repository/locacaoRepository.js';

const server = Router();

// Listar locações (com dados do cliente e veículo)
server.get('/locacao', async (req, resp) => {
    try {
        let r = await locacaoRepo.listarLocacoes();
        resp.send(r);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

// Listar todas as locações (pendentes e concluídas)
server.get('/locacao/todas', async (req, resp) => {
    try {
        let r = await locacaoRepo.listarTodasLocacoes();
        resp.send(r);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

// Inserir nova locação
server.post('/locacao', async (req, resp) => {
    try {
        let nova = await locacaoRepo.inserirLocacao(req.body);
        resp.send(nova);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

// Editar locação
server.put('/locacao/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        let linhas = await locacaoRepo.alterarLocacao(id, req.body);
        resp.send({ linhasAfetadas: linhas });
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

// Excluir locação
server.delete('/locacao/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        let linhas = await locacaoRepo.deletarLocacao(id);
        resp.send({ linhasAfetadas: linhas });
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

server.get('/locacao/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        let locacao = await locacaoRepo.buscarLocacaoPorId(id);
        if (!locacao)
            return resp.status(404).send({ erro: 'Locação não encontrada' });
        resp.send(locacao);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

server.put('/locacao/entrega/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        const { dataEntrega, kmEntrega, valorTotal } = req.body;

        const linhasAfetadas = await concluirEntregaLocacao(id, {
            dataEntrega,
            kmEntrega,
            valorTotal
        });

        if (linhasAfetadas === 0)
            return resp.status(404).send({ erro: 'Locação não encontrada' });

        resp.status(204).send();
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

export default server;