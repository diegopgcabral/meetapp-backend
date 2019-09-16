import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;

    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: `[${meetup.title}] - Nova inscrição`,
      template: 'subscription',
      context: {
        organizer: meetup.User.name,
        meetup: meetup.title,
        date: format(
          parseISO(meetup.date),
          "'dia' dd 'de' MMMM 'de' yyyy', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        user: user.name,
        email: user.email,
      },
    });
  }
}

export default new SubscriptionMail();
