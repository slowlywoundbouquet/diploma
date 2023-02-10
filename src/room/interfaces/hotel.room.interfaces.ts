import { ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';

export type TID = string | ObjectId | mongoose.Schema.Types.ObjectId;

export interface IHotelRoom {
  hotel: TID;
  description: string;
  images?: Array<string>;
  isEnabled: boolean;
}
