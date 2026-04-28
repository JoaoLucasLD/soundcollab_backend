import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class ExploreMusiciansQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  instrument?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  style?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  experienceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  experienceMax?: number;
}
