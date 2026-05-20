import { CollaborationGoal, Gender, Instrument, Profile, Style } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
type ProfileWithRelations = Profile & {
    instruments: Instrument[];
    styles: Style[];
};
type CreateProfileParams = {
    userId: string;
    displayName: string;
    city: string | null;
    gender: Gender | null;
    experience: number | null;
    preferences: string | null;
    bio: string | null;
    collaborationGoals: CollaborationGoal[];
};
type UpdateProfileParams = {
    displayName?: string;
    city?: string | null;
    gender?: Gender | null;
    experience?: number | null;
    preferences?: string | null;
    bio?: string | null;
    collaborationGoals?: CollaborationGoal[];
};
export declare class ProfilesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string): Promise<ProfileWithRelations | null>;
    findById(profileId: string): Promise<ProfileWithRelations | null>;
    create(params: CreateProfileParams): Promise<ProfileWithRelations>;
    updateById(profileId: string, data: UpdateProfileParams): Promise<ProfileWithRelations>;
    findInstrumentsByIds(instrumentIds: string[]): Promise<Instrument[]>;
    findStylesByIds(styleIds: string[]): Promise<Style[]>;
    addInstrumentIds(profileId: string, instrumentIds: string[]): Promise<ProfileWithRelations>;
    setInstrumentIds(profileId: string, instrumentIds: string[]): Promise<ProfileWithRelations>;
    removeInstrumentIds(profileId: string, instrumentIds: string[]): Promise<ProfileWithRelations>;
    addStyleIds(profileId: string, styleIds: string[]): Promise<ProfileWithRelations>;
    setStyleIds(profileId: string, styleIds: string[]): Promise<ProfileWithRelations>;
    removeStyleIds(profileId: string, styleIds: string[]): Promise<ProfileWithRelations>;
}
export {};
