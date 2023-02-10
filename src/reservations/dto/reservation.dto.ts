import { IsString } from 'class-validator';

export class ReservationDto {
  @IsString({ message: 'Должно быть строкой' })
  hotelRoom: string;

  @IsString({ message: 'Должно быть строкой' })
  dateStart: string;

  @IsString({ message: 'Должно быть строкой' })
  dateEnd: string;
}
