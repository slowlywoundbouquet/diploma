import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TID } from 'src/room/interfaces/hotel.room.interfaces';
import { CreateUserDTO } from './dto/create-user.dto';
import { ISearchParams } from './interfaces/search.params.interface';
import { User, UserDocument } from './schemas/user.schemas';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async create(data: Partial<CreateUserDTO>) {
    const newUser = new this.UserModel(data);
    return await newUser.save();
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.UserModel.findOne({ email });
    return user;
  }

  async updateDeauth(id: TID, deauth: boolean) {
    try {
      return await this.UserModel.findByIdAndUpdate(id, { deauth });
    } catch (error) {
      return error;
    }
  }

  async findUsers(params: ISearchParams) {
    const skip = Number(params.offset) || 0;
    const limit = Number(params.limit) || 6;

    try {
      return await this.UserModel.find({
        lastName: params.lastName,
        email: params.email,
        contactPhone: params.contactPhone,
      })
        .skip(skip)
        .limit(limit)
        .select('-updatedAt')
        .select('-__v')
        .select('-createdAt')
        .select('-isEnabled')
        .exec();
    } catch (error) {
      return error;
    }
  }
}
