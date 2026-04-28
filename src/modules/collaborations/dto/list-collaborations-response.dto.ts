import { CollaborationResponseDto } from './collaboration-response.dto';

export class CollaborationsListMetaDto {
  page!: number;
  limit!: number;
  total!: number;
  totalPages!: number;
}

export class ListCollaborationsResponseDto {
  items!: CollaborationResponseDto[];
  meta!: CollaborationsListMetaDto;
}
