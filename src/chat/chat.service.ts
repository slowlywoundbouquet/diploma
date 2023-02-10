import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { SupportRequest } from './schemas/support.request .schema';
export class ChartService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
  ) {}

  async sendMessage(message) {
    const messagesRes = new this.messageModel(message);

    messagesRes.save();

    await this.supportRequestModel.findOneAndUpdate(
      { _id: message.supportRequest },
      {
        $push: { messages: messagesRes._id },
      },
      { new: true },
    );

    const supportRequest = await this.supportRequestModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: ['$_id', { $toObjectId: message.supportRequest }],
          },
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'author',
        },
      },

      {
        $lookup: {
          from: 'messages',
          localField: 'messages',
          foreignField: '_id',
          as: 'messages',
        },
      },
      { $unwind: '$messages' },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          text: '$messages.text',
          readAt: '$messages.readAt',
          'author._id': 1,
          'author.lastName': 1,
        },
      },
    ]);

    return supportRequest;
  }
  async getMessages() {
    return await this.messageModel.find();
  }
}
