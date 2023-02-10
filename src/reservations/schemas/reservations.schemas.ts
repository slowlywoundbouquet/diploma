import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schemas';
import { Hotel } from 'src/hotel/schemas/hotel.schemas';
import { HotelRoom } from 'src/room/schemas/hotelRoom.schemas';
import { TID } from 'src/room/interfaces/hotel.room.interfaces';
import { IReservation } from '../interfaces/reservations.interface';

@Schema({ timestamps: true })
export class Reservations extends Document implements IReservation {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  public userId: TID;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Hotel.name,
  })
  public hotelId: TID;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: HotelRoom.name,
  })
  public roomId: TID;

  @Prop({ required: true })
  public dateStart: Date;

  @Prop({ required: true })
  public dateEnd: Date;
}

export const ReservationsSchema = SchemaFactory.createForClass(Reservations);
