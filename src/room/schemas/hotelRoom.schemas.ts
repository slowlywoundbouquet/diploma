import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Hotel } from 'src/hotel/schemas/hotel.schemas';
import { IHotelRoom, TID } from '../interfaces/hotel.room.interfaces';

@Schema({ timestamps: true })
export class HotelRoom extends Document implements IHotelRoom {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Hotel.name,
  })
  public hotel: TID;

  @Prop()
  public description: string;

  @Prop({ default: [] })
  public images?: Array<string>;

  @Prop({ required: true, default: true })
  public isEnabled: boolean;
}
export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
