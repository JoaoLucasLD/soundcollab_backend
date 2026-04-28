export interface MatchmakingProfile {
  id: string;
  userId: string;
  displayName: string;
  city: string | null;
  latitude?: number | null;
  longitude?: number | null;
  experience: number | null;
  preferences: string | null;
  instruments: string[];
  styles: string[];
}
