import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação dos campos' });
    }
    /**
     * Preciso verificar se o evento a ser cadastrado não é uma data passada
     */
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Data do evento inválida' });
    }

    /**
     * Pego o id do usuário que está logado
     */
    const user_id = req.userId;

    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      file_id: Yup.number(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação dos campos' });
    }
    // ID do usuário logado
    const user_id = req.userId;

    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup não existe' });
    }

    // Só pode alterar se o usuário logado é o proprietário do Meetup
    if (user_id !== meetup.user_id) {
      return res.status(401).json({ error: 'Usuário não autorizado' });
    }

    // Verifico se a data enviada é válida
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Data do Meetup inválida' });
    }

    // Verifico se o Meetup já aconteceu
    if (meetup.past) {
      return res.status(400).json({ error: 'Meetup já aconteceu' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    const user_id = req.userId;

    if (user_id !== meetup.user_id) {
      return res.status(400).json({ error: 'Usuário não autorizado' });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'Não é permitido excluir Meetup que já ocorreu' });
    }

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();
