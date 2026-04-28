import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChatConversationDto {
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  collaborationId!: string;
}
