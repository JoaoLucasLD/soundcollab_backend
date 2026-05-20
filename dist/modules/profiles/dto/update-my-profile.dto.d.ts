import { CollaborationGoal, Gender } from '@prisma/client';
export declare class UpdateMyProfileDto {
    displayName?: string;
    city?: string;
    gender?: Gender;
    experience?: number;
    preferences?: string;
    bio?: string;
    collaborationGoals?: CollaborationGoal[];
}
