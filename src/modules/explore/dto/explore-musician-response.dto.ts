import { Gender } from '@prisma/client';

export class ExploreMusicianResponseDto {
  id!: string;
  userId!: string;
  displayName!: string;
  city!: string | null;
  gender!: Gender | null;
  age!: number | null;
  distanceKm!: number | null;
  experience!: number | null;
  preferences!: string | null;
  instruments!: string[];
  styles!: string[];
}

export class ExploreMusiciansResponseDto {
  musicians!: ExploreMusicianResponseDto[];
  total!: number;
}
