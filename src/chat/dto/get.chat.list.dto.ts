import { TID } from 'src/room/interfaces/hotel.room.interfaces';

export interface GetChatListDto {
  user: TID | null;
  isActive: boolean;
}
