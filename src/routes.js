import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionControler from './app/controllers/SessionController';
import MeetupController from './app/controllers/MeetupController';
import OrganizingController from './app/controllers/OrganizingController';
import SubscriptionController from './app/controllers/SubscriptionController';

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
// Cadastrar um novo Meetup
routes.post('/meetups', MeetupController.store);
// Alterar um Meetup Cadastrado
routes.put('/meetups/:id', MeetupController.update);
// Rota para deletar Meetup que pertence ao usuário logado
routes.delete('/meetups/:id', MeetupController.delete);
// Listagem de Meetups
routes.get('/meetups', MeetupController.index);
// Listar os Meetups cadastrado pelo usuário logado
routes.get('/organizing', OrganizingController.index);
// Realizar inscrições em Meetups do usuário logado
routes.post('/meetups/:meetupId/subscriptions', SubscriptionController.store);
// Upload do arquivo
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
