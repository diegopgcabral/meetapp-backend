import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import User from '../models/User';
import Meetup from '../models/Meetup';

import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';

class SubscriptionController {
  async index(req, res) {
    const subscription = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });
    return res.json(subscription);
  }

  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [User],
    });

    if (!meetup) {
      return res.status(400).json({
        error: 'Meetup não existe',
      });
    }
    /**
     * Valido se o usuário logado é organizador do Meetup
     */
    if (req.userId === meetup.user_id) {
      return res.status(400).json({
        error: 'Você é o organizador do Meetup, não pode fazer inscrição',
      });
    }
    /**
     * Verifico se o Meetup já aconteceu
     */
    if (meetup.past) {
      return res.status(400).json({
        error: 'O Meetup selecionado que já foi realizado',
      });
    }
    /**
     * Verifico se o usuário já está inscrito no Meetup que deseja se inscrever
     */
    const checkSubscription = await Subscription.findAll({
      where: { user_id: req.userId, meetup_id: meetup.id },
    });

    if (checkSubscription.length > 0) {
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }
    /**
     * Verifico se o usuário logado está cadastrado em + de 1 meetup na mesma
     * data e hora
     */
    const checkSameTimeMeetup = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkSameTimeMeetup.length > 0) {
      return res
        .status(400)
        .json({ error: 'Você já está cadastrado em um Meetup na mesma data' });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
