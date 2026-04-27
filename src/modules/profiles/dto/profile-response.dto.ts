export class ProfileResponseDto {
  id!: string;
  userId!: string;
  displayName!: string;
  city!: string | null;
  experience!: number | null;
  preferences!: string | null;
  instruments!: string[];
  styles!: string[];
  createdAt!: Date;
  updatedAt!: Date;
}
