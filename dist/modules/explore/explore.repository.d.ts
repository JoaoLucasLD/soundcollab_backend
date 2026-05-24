import { Gender, Instrument, Prisma, Profile, Style } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
export type ExploreFilters = {
    excludeUserId: string;
    instrument?: string;
    style?: string;
    city?: string;
    gender?: Gender;
    experienceMin?: number;
    experienceMax?: number;
};
type ProfileWithRelations = Profile & {
    instruments: Instrument[];
    styles: Style[];
};
export declare class ExploreRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findProfileLocation(userId: string): Prisma.Prisma__ProfileClient<{
        latitude: number | null;
        longitude: number | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findMusicians(filters: ExploreFilters): Promise<ProfileWithRelations[]>;
}
export {};
