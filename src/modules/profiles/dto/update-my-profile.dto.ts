import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  AvailabilityPeriod,
  AvailabilityTime,
  CollaborationGoal,
  Gender,
} from '@prisma/client';

export class UpdateMyProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number | null;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  experience?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  preferences?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(CollaborationGoal, { each: true })
  collaborationGoals?: CollaborationGoal[];

  @IsOptional()
  @IsArray()
  @IsEnum(AvailabilityPeriod, { each: true })
  availabilityPeriods?: AvailabilityPeriod[];

  @IsOptional()
  @IsArray()
  @IsEnum(AvailabilityTime, { each: true })
  availabilityTimes?: AvailabilityTime[];

  @IsOptional()
  @IsString()
  @MaxLength(300)
  availabilityNotes?: string;
}
