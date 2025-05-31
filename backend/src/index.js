import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authController from './controller/authController.js'
import clienteController from './controller/clienteController.js'
import locacaoController from './controller/locacaoController.js'
import veiculoController from './controller/veiculoController.js'
import { authenticateToken } from './middleware/auth.js'

let servidor = express();
servidor.use(cors());
servidor.use(express.json());

// Rotas públicas (sem autenticação)
servidor.use(authController);

// Rotas protegidas (com autenticação)
servidor.use(authenticateToken);
servidor.use(clienteController);
servidor.use(locacaoController);
servidor.use(veiculoController);

servidor.listen(process.env.PORT,
                () => console.log('API subiu na porta ' + process.env.PORT));