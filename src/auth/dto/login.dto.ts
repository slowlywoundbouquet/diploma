import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDTO {
  @IsEmail({}, { message: 'Некорректный Email' })
  readonly email: string;

  @IsString({ message: 'Должно быть строкой' })
  @Length(6, 16, { message: 'Не меньше 6 и не больше 16' })
  readonly password: string;
}
