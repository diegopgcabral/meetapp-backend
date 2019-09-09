import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionControler from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Cadastro de usuário
routes.post('/users', UserController.store);
// Validar sessão do usuário
routes.post('/sessions', SessionControler.store);

/**
 * Todas as rotas para baixo, terão o token validado.
 */
routes.use(authMiddleware);

// Alteração dados do usuário
routes.put('/users', UserController.update);

export default routes;
