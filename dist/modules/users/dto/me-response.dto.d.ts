import { CollaborationGoal, Gender } from '@prisma/client';
export declare class MeProfileDto {
    id: string;
    displayName: string;
    city: string | null;
    gender: Gender | null;
    experience: number | null;
    preferences: string | null;
    bio: string | null;
    collaborationGoals: CollaborationGoal[];
    instruments: string[];
    styles: string[];
}
export declare class MeResponseDto {
    id: string;
    email: string;
    createdAt: Date;
    profile: MeProfileDto | null;
}
