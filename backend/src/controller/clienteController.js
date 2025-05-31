import { Router } from "express";
import { inserir, consultar, alterar, deletar } from '../repository/clienteRepository.js';

const endpoints = Router();

endpoints.post('/cliente', async (req, resp) => {
  try {
    let cliente = req.body;
    let r = await inserir(cliente);
    resp.send(r);
  } catch (err) {
    resp.status(500).send({ erro: err.message });
  }
});

endpoints.get('/cliente', async (req, resp) => {
  try {
    let busca = req.query.busca ?? '';  // Trocamos 'nome' por 'busca' para corresponder ao frontend
    let r = await consultar(busca);
    resp.send(r);
  } catch (err) {
    resp.status(500).send({ erro: err.message });
  }
});

endpoints.put('/cliente/:id', async (req, resp) => {
  try {
    let id = req.params.id;
    let cliente = req.body;
    let r = await alterar(id, cliente);
    resp.send();
  } catch (err) {
    resp.status(500).send({ erro: err.message });
  }
});

endpoints.delete('/cliente/:id', async (req, resp) => {
  try {
    let id = req.params.id;
    let r = await deletar(id);
    resp.send();
  } catch (err) {
    resp.status(500).send({ erro: err.message });
  }
});

export default endpoints;