import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomService } from 'src/room/room.service';
import { TID } from 'src/room/interfaces/hotel.room.interfaces';
import { User } from 'src/users/schemas/user.schemas';
import { ReservationDto } from './dto/reservation.dto';
import { Reservations } from './schemas/reservations.schemas';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservations.name)
    private reservationsModel: Model<Reservations>,
    private hotelRoomService: RoomService,
  ) {}

  async addReservation(data: ReservationDto, id: TID) {
    try {
      const checkDateReservation = await this.reservationsModel.find({
        dateStart: {
          $lte: new Date(data.dateEnd),
          $gte: new Date(data.dateStart),
        },
      });

      if (checkDateReservation.length) {
        throw new BadRequestException('На эти даты уже есть бронь');
      }

      const hotelRoom = await this.hotelRoomService.getHotelRoom(
        data.hotelRoom,
      );
      if (!hotelRoom || !hotelRoom.isEnabled) throw new BadRequestException();

      const newReservation = new this.reservationsModel({
        ...data,
        roomId: data.hotelRoom,
        userId: id,
        hotelId: hotelRoom.hotel,
      });
      await newReservation.save();
      return newReservation;
    } catch (error) {
      return error;
    }
  }

  async getReservations(id: TID) {
    try {
      return await this.reservationsModel
        .find({ userId: id })
        .select('-__v')
        .select('-updatedAt')
        .select('-createdAt')
        .select('-userId')
        .select('-_id');
    } catch (error) {
      return error;
    }
  }

  async removeReservation(id: TID, user: User & { _id: TID }) {
    try {
      const room = await this.reservationsModel.findById(id);
      if (!room) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
      if (room.userId.toString() !== user._id.toString()) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      return await this.reservationsModel.deleteOne({ _id: id });
    } catch (error) {
      return error;
    }
  }

  async removeManagerReservation(id: TID) {
    try {
      const room = await this.reservationsModel.findById(id);
      if (!room) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);

      return await this.reservationsModel.deleteOne({ _id: id });
    } catch (error) {
      return error;
    }
  }

  async getUserReservations(userId: string, dateStart: Date, dateEnd: Date) {
    try {
      return await this.reservationsModel.find({
        userId,
        createdAt: {
          $lte: new Date(dateEnd),
          $gte: new Date(dateStart),
        },
      });
    } catch (error) {
      return error;
    }
  }
}
