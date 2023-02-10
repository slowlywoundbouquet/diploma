import { CreateHotelRoomDTo } from './create.hotel.room.dto';

export class UpdateHotelRoomDTO extends CreateHotelRoomDTo {
  readonly isEnabled: boolean;
}
