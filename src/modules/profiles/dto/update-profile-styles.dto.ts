import {
  ArrayMaxSize,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfileStylesDto {
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(64, { each: true })
  styleIds!: string[];
}
