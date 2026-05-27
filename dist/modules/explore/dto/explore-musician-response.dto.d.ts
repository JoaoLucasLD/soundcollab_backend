import { AvailabilityPeriod, AvailabilityTime, CollaborationGoal, Gender } from '@prisma/client';
export declare class ExploreMusicianResponseDto {
    id: string;
    userId: string;
    displayName: string;
    city: string | null;
    gender: Gender | null;
    age: number | null;
    distanceKm: number | null;
    experience: number | null;
    bio: string | null;
    preferences: string | null;
    collaborationGoals: CollaborationGoal[];
    availabilityPeriods: AvailabilityPeriod[];
    availabilityTimes: AvailabilityTime[];
    instruments: string[];
    styles: string[];
}
export declare class ExploreMusiciansResponseDto {
    musicians: ExploreMusicianResponseDto[];
    total: number;
}
