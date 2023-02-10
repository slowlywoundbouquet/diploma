import { IsString, Length } from 'class-validator';

export class AddHotelParamsDTO {
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string;

  @IsString({ message: 'Должно быть строкой' })
  @Length(6, 16, { message: 'Не меньше 6 и не больше 16' })
  readonly title: string;
}
