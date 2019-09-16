import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamp: true,
  }
);

export default mongoose.model('Subscription', SubscriptionSchema);
