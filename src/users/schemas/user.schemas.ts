import { RouterModule } from '@nestjs/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../enums/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  public email: string;
  @Prop({ required: true })
  public password: string;
  @Prop()
  public contactPhone: string;
  @Prop({ required: true })
  public lastName: string;
  @Prop({ required: true, default: Role.Client })
  public role: Role;
  @Prop({ default: false })
  public deauth: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
