import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TID } from 'src/room/interfaces/hotel.room.interfaces';
import { IFindSearchParams } from 'src/hotel/interfaces/find-search.params.interface';
import { User } from 'src/users/schemas/user.schemas';
import { CreateSupportRequestDto } from './dto/create.support.request.dto';
import { Message } from './schemas/message.schema';
import { SupportRequest } from './schemas/support.request .schema';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}
  async createSupportRequest(
    data: CreateSupportRequestDto,
    user: User & { _id: TID },
  ) {
    const newMessage = new this.messageModel({
      author: user._id,
      text: data.text,
    });

    const newSupportRequest = new this.supportRequestModel({
      user: user._id,
    });

    try {
      await newMessage.save();
      newSupportRequest.messages = [newMessage._id];
      await newSupportRequest.save();
      return [
        {
          id: newSupportRequest._id,
          createdAt: newSupportRequest.createdAt,
          isActive: newSupportRequest.isActive,
          hasNewMessages: true,
        },
      ];
    } catch (error) {
      return error;
    }
  }
  async getSupportCallsClient(
    params: Omit<IFindSearchParams & { isActive: boolean }, 'hotel'>,
  ) {
    try {
      const skip = Number(params.offset) || 0;
      const limit = Number(params.limit) || 6;

      const supportMessage = await this.supportRequestModel.aggregate([
        { $match: { isActive: Boolean(params.isActive) } },
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
          $addFields: {
            hasNewMessages: {
              $or: [
                {
                  $in: ['$messages.readAt', [null]],
                },
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            isActive: 1,
            hasNewMessages: 1,
          },
        },

        { $skip: skip },
        { $limit: limit },
      ]);
      return supportMessage;
    } catch (error) {
      return error;
    }
  }

  async getSupportCallsManager(
    params: Omit<IFindSearchParams & { isActive: boolean }, 'hotel'>,
  ) {
    try {
      const skip = Number(params.offset) || 0;
      const limit = Number(params.limit) || 6;

      const supportMessage = await this.supportRequestModel.aggregate([
        { $match: { isActive: Boolean(params.isActive) } },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'client',
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
          $addFields: {
            hasNewMessages: {
              $or: [
                {
                  $in: ['$messages.readAt', [null]],
                },
              ],
            },
          },
        },

        {
          $project: {
            _id: 1,
            createdAt: 1,
            isActive: 1,
            hasNewMessages: 1,
            'client._id': 1,
            'client.name': 1,
            'client.email': 1,
            'client.contactPhone': 1,
          },
        },

        { $skip: skip },
        { $limit: limit },
      ]);
      return supportMessage;
    } catch (error) {
      return error;
    }
  }

  async getHistoryMessageSupportCalls(id: string) {
    try {
      return await this.supportRequestModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: id }],
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
    } catch (error) {
      return error;
    }
  }

  async markMessagesAsRead(id: string, readAt: string) {
    try {
      return await this.supportRequestModel
        .findById(id)
        .then(async (supportRequests) => {
          supportRequests.messages.forEach(async (messageId) => {
            await this.messageModel.updateOne(
              { _id: messageId },
              {
                $set: { readAt: readAt },
              },
            );
          });
          return {
            success: true,
          };
        });
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  async closeRequest(id: string) {
    try {
      return this.supportRequestModel.findByIdAndUpdate(
        id,
        {
          isActive: false,
        },
        { new: true },
      );
    } catch (error) {
      return error;
    }
  }
}
