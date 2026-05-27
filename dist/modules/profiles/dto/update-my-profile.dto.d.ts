import { AvailabilityPeriod, AvailabilityTime, CollaborationGoal, Gender } from '@prisma/client';
export declare class UpdateMyProfileDto {
    displayName?: string;
    city?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    gender?: Gender;
    birthDate?: string;
    experience?: number;
    preferences?: string;
    bio?: string;
    collaborationGoals?: CollaborationGoal[];
    availabilityPeriods?: AvailabilityPeriod[];
    availabilityTimes?: AvailabilityTime[];
    availabilityNotes?: string;
}
