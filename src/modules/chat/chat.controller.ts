import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/authenticated-user.interface';
import { ChatService } from './chat.service';
import { ChatConversationResponseDto } from './dto/chat-conversation-response.dto';
import { ChatMessageResponseDto } from './dto/chat-message-response.dto';
import { CreateChatConversationDto } from './dto/create-chat-conversation.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ListChatMessagesQueryDto } from './dto/list-chat-messages-query.dto';
import { ListChatMessagesResponseDto } from './dto/list-chat-messages-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  createConversation(
    @Req() req: RequestWithUser,
    @Body() body: CreateChatConversationDto,
  ): Promise<ChatConversationResponseDto> {
    return this.chatService.createConversation(req.user.userId, body);
  }

  @Get('conversations/:conversationId/messages')
  listMessages(
    @Req() req: RequestWithUser,
    @Param('conversationId') conversationId: string,
    @Query() query: ListChatMessagesQueryDto,
  ): Promise<ListChatMessagesResponseDto> {
    return this.chatService.listMessages(req.user.userId, conversationId, query);
  }

  @Post('conversations/:conversationId/messages')
  createMessage(
    @Req() req: RequestWithUser,
    @Param('conversationId') conversationId: string,
    @Body() body: CreateChatMessageDto,
  ): Promise<ChatMessageResponseDto> {
    return this.chatService.createMessage(req.user.userId, conversationId, body);
  }
}
