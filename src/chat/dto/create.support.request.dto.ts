import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupportRequestDto {
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  text: string;
}
