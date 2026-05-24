import { Gender } from '@prisma/client';
export declare class ExploreMusiciansQueryDto {
    instrument?: string;
    style?: string;
    city?: string;
    gender?: Gender;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    experienceMin?: number;
    experienceMax?: number;
}
