import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionControler from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

// Cadastro de usuário
routes.post('/users', UserController.store);
// Validar sessão do usuário
routes.post('/sessions', SessionControler.store);

/**
 * Middleware de Autenticação Global para as próximas rotas
 */
routes.use(authMiddleware);

// Alteração dados do usuário
routes.put('/users', UserController.update);

// Upload do arquivo
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
