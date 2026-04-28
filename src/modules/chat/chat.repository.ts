import { Injectable } from '@nestjs/common';
import {
  ChatConversation,
  ChatMessage,
  Collaboration,
  CollaborationStatus,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

export type ChatConversationWithCollaboration = ChatConversation & {
  collaboration: Collaboration;
};

type ListMessagesParams = {
  conversationId: string;
  skip: number;
  take: number;
};

type ListMessagesResult = {
  items: ChatMessage[];
  total: number;
};

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCollaborationById(collaborationId: string): Promise<Collaboration | null> {
    return this.prisma.collaboration.findUnique({
      where: { id: collaborationId },
    });
  }

  findAcceptedCollaborationById(
    collaborationId: string,
  ): Promise<Collaboration | null> {
    return this.prisma.collaboration.findFirst({
      where: {
        id: collaborationId,
        status: CollaborationStatus.ACCEPTED,
      },
    });
  }

  findConversationByCollaborationId(
    collaborationId: string,
  ): Promise<ChatConversation | null> {
    return this.prisma.chatConversation.findUnique({
      where: { collaborationId },
    });
  }

  createConversation(collaborationId: string): Promise<ChatConversation> {
    return this.prisma.chatConversation.create({
      data: { collaborationId },
    });
  }

  findConversationWithCollaboration(
    conversationId: string,
  ): Promise<ChatConversationWithCollaboration | null> {
    return this.prisma.chatConversation.findUnique({
      where: { id: conversationId },
      include: { collaboration: true },
    });
  }

  createMessage(params: {
    conversationId: string;
    senderId: string;
    content: string;
  }): Promise<ChatMessage> {
    return this.prisma.chatMessage.create({
      data: {
        conversationId: params.conversationId,
        senderId: params.senderId,
        content: params.content,
      },
    });
  }

  async listMessages(params: ListMessagesParams): Promise<ListMessagesResult> {
    const [items, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where: { conversationId: params.conversationId },
        orderBy: {
          createdAt: 'asc',
        },
        skip: params.skip,
        take: params.take,
      }),
      this.prisma.chatMessage.count({
        where: { conversationId: params.conversationId },
      }),
    ]);

    return {
      items,
      total,
    };
  }
}
