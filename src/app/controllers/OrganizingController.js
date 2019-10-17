import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

import Meetup from '../models/Meetup';
import User from '../models/User';

class OrganizingController {
  async index(req, res) {
    const where = { user_id: req.userId };
    const page = req.query.page || 1;

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
      order: ['date'],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }
}

export default new OrganizingController();
