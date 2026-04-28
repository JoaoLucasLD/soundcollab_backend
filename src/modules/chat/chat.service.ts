import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatConversation, ChatMessage, CollaborationStatus } from '@prisma/client';
import { ChatConversationResponseDto } from './dto/chat-conversation-response.dto';
import { ChatMessageResponseDto } from './dto/chat-message-response.dto';
import { CreateChatConversationDto } from './dto/create-chat-conversation.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ListChatMessagesQueryDto } from './dto/list-chat-messages-query.dto';
import { ListChatMessagesResponseDto } from './dto/list-chat-messages-response.dto';
import { ChatConversationWithCollaboration, ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async createConversation(
    userId: string,
    input: CreateChatConversationDto,
  ): Promise<ChatConversationResponseDto> {
    const collaborationId = this.normalizeRequiredText(
      input.collaborationId,
      'collaborationId',
    );

    const acceptedCollaboration =
      await this.chatRepository.findAcceptedCollaborationById(collaborationId);

    if (!acceptedCollaboration) {
      const collaboration =
        await this.chatRepository.findCollaborationById(collaborationId);

      if (!collaboration) {
        throw new NotFoundException('Collaboration not found');
      }

      throw new ConflictException(
        'Chat is available only for accepted collaborations',
      );
    }

    this.ensureUserBelongsToCollaboration(userId, acceptedCollaboration);

    const existingConversation =
      await this.chatRepository.findConversationByCollaborationId(collaborationId);
    if (existingConversation) {
      return this.toConversationResponse(existingConversation);
    }

    const createdConversation =
      await this.chatRepository.createConversation(collaborationId);
    return this.toConversationResponse(createdConversation);
  }

  async listMessages(
    userId: string,
    conversationId: string,
    query: ListChatMessagesQueryDto,
  ): Promise<ListChatMessagesResponseDto> {
    const normalizedConversationId = this.normalizeRequiredText(
      conversationId,
      'conversationId',
    );

    const conversation = await this.getAuthorizedConversation(
      userId,
      normalizedConversationId,
    );

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const { items, total } = await this.chatRepository.listMessages({
      conversationId: conversation.id,
      skip,
      take: limit,
    });

    return {
      items: items.map((message) => this.toMessageResponse(message)),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async createMessage(
    userId: string,
    conversationId: string,
    input: CreateChatMessageDto,
  ): Promise<ChatMessageResponseDto> {
    const normalizedConversationId = this.normalizeRequiredText(
      conversationId,
      'conversationId',
    );
    const normalizedContent = this.normalizeRequiredText(input.content, 'content');

    const conversation = await this.getAuthorizedConversation(
      userId,
      normalizedConversationId,
    );

    const createdMessage = await this.chatRepository.createMessage({
      conversationId: conversation.id,
      senderId: userId,
      content: normalizedContent,
    });

    return this.toMessageResponse(createdMessage);
  }

  private async getAuthorizedConversation(
    userId: string,
    conversationId: string,
  ): Promise<ChatConversationWithCollaboration> {
    const conversation =
      await this.chatRepository.findConversationWithCollaboration(conversationId);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.collaboration.status !== CollaborationStatus.ACCEPTED) {
      throw new ConflictException(
        'Chat is available only for accepted collaborations',
      );
    }

    this.ensureUserBelongsToCollaboration(userId, conversation.collaboration);

    return conversation;
  }

  private ensureUserBelongsToCollaboration(
    userId: string,
    collaboration: {
      requesterId: string;
      receiverId: string;
    },
  ): void {
    if (
      collaboration.requesterId !== userId &&
      collaboration.receiverId !== userId
    ) {
      throw new ForbiddenException(
        'Only collaboration participants can access this chat',
      );
    }
  }

  private normalizeRequiredText(value: string, fieldName: string): string {
    const normalized = value.trim();
    if (normalized.length === 0) {
      throw new BadRequestException(`${fieldName} cannot be empty`);
    }

    return normalized;
  }

  private toConversationResponse(
    model: ChatConversation,
  ): ChatConversationResponseDto {
    return {
      id: model.id,
      collaborationId: model.collaborationId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  private toMessageResponse(model: ChatMessage): ChatMessageResponseDto {
    return {
      id: model.id,
      conversationId: model.conversationId,
      senderId: model.senderId,
      content: model.content,
      createdAt: model.createdAt,
    };
  }
}
