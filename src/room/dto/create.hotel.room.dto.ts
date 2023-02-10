import { IsString, Length } from 'class-validator';

export class CreateHotelRoomDTo {
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string;
  @Length(6, 50, { message: 'Должно быть заполненно' })
  @IsString({ message: 'Должно быть строкой' })
  readonly hotelId: string;
  readonly images: File[];
}
