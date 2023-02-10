import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ISupport } from '../interfaces/support.interface';
import { User } from 'src/users/schemas/user.schemas';
import { TID } from 'src/room/interfaces/hotel.room.interfaces';
import { Message } from './message.schema';

@Schema()
export class SupportRequest extends Document implements ISupport {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: TID;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({
    type: Array,
    required: true,
    ref: Message.name,
  })
  messages: [Message];

  @Prop({ default: true })
  isActive: boolean;
}
export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
