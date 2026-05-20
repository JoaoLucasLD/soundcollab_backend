import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateInstrumentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name!: string;

  @IsString()
  @MinLength(1)
  categoryId!: string;
}
