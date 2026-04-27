export class MeProfileDto {
  id!: string;
  displayName!: string;
  city!: string | null;
  experience!: number | null;
  preferences!: string | null;
  instruments!: string[];
  styles!: string[];
}

export class MeResponseDto {
  id!: string;
  email!: string;
  createdAt!: Date;
  profile!: MeProfileDto | null;
}
