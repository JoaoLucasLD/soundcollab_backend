import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCollaborationDto {
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  receiverId!: string;
}
