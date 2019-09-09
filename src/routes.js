import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();

// Cadastro de usuário
routes.post('/users', UserController.store);

export default routes;
