import { Instrument, Profile, Style } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
type ProfileWithRelations = Profile & {
    instruments: Instrument[];
    styles: Style[];
};
type CreateProfileParams = {
    userId: string;
    displayName: string;
    city: string | null;
    experience: number | null;
    preferences: string | null;
};
type UpdateProfileParams = {
    displayName?: string;
    city?: string | null;
    experience?: number | null;
    preferences?: string | null;
};
export declare class ProfilesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string): Promise<ProfileWithRelations | null>;
    create(params: CreateProfileParams): Promise<ProfileWithRelations>;
    updateById(profileId: string, data: UpdateProfileParams): Promise<ProfileWithRelations>;
    addInstruments(profileId: string, instruments: string[]): Promise<ProfileWithRelations>;
    addStyles(profileId: string, styles: string[]): Promise<ProfileWithRelations>;
}
export {};
