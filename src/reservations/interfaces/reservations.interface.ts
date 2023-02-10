import { TID } from 'src/room/interfaces/hotel.room.interfaces';

export interface IReservation {
  userId: TID;
  hotelId: TID;
  roomId: TID;
  dateStart: Date;
  dateEnd: Date;
}
