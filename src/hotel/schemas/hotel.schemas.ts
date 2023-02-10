import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IHotel {
  title: string;
  description?: string;
}
@Schema({ timestamps: true })
export class Hotel extends Document implements IHotel {
  @Prop({ required: true })
  public title: string;

  @Prop()
  public description?: string;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
