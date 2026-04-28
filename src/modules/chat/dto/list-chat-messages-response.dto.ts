import { ChatMessageResponseDto } from './chat-message-response.dto';

export class ListChatMessagesMetaDto {
  page!: number;
  limit!: number;
  total!: number;
  totalPages!: number;
}

export class ListChatMessagesResponseDto {
  items!: ChatMessageResponseDto[];
  meta!: ListChatMessagesMetaDto;
}
