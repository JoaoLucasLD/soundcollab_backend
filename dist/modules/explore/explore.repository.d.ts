import { Gender, Instrument, Profile, Style } from '@prisma/client';
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
    findMusicians(filters: ExploreFilters): Promise<ProfileWithRelations[]>;
}
export {};
