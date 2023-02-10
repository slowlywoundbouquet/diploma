import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddHotelParamsDTO } from './dto/add.hotel.params.dto';
import { UpdateHotelParamsDTO } from './dto/update.hotel.params.dto';
import { IFindSearchParams } from './interfaces/find-search.params.interface';
import { Hotel } from './schemas/hotel.schemas';

@Injectable()
export class HotelService {
  constructor(@InjectModel(Hotel.name) private hotelModel: Model<Hotel>) {}

  async addHotel(addHotelDTO: AddHotelParamsDTO) {
    const newHotel = new this.hotelModel(addHotelDTO);
    return await newHotel.save();
  }

  async getHotels(params: Omit<IFindSearchParams, 'hotel'>) {
    const skip = Number(params.offset) || 0;
    const limit = Number(params.limit) || 6;

    return this.hotelModel
      .find()
      .skip(skip)
      .limit(limit)
      .select('-updatedAt')
      .select('-__v')
      .select('-createdAt')
      .exec();
  }

  async updateHotel(updateHotelParamsDTO: UpdateHotelParamsDTO, id: string) {
    return this.hotelModel.findByIdAndUpdate(id, updateHotelParamsDTO, {
      new: true,
    });
  }

  async findById(id: string) {
    return await this.hotelModel
      .findById(id)
      .select('-updatedAt')
      .select('-__v')
      .select('-createdAt')
      .exec();
  }
}
