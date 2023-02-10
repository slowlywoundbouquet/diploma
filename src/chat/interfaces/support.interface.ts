import { TID } from 'src/room/interfaces/hotel.room.interfaces';

export interface ISupport {
  user: TID;
  createdAt: Date;
  messages: IMessage[];
  isActive: boolean;
}

export interface IMessage {
  author: TID;
  sentAt: Date;
  text: string;
  readAt: Date;
}
