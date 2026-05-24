import { AvailabilityPeriod, AvailabilityTime, CollaborationGoal, Gender } from '@prisma/client';
export declare class MeProfileDto {
    id: string;
    displayName: string;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    gender: Gender | null;
    birthDate: string | null;
    age: number | null;
    experience: number | null;
    preferences: string | null;
    bio: string | null;
    collaborationGoals: CollaborationGoal[];
    availabilityPeriods: AvailabilityPeriod[];
    availabilityTimes: AvailabilityTime[];
    availabilityNotes: string | null;
    instruments: string[];
    styles: string[];
}
export declare class MeResponseDto {
    id: string;
    email: string;
    createdAt: Date;
    profile: MeProfileDto | null;
}
