import { Gender } from '@prisma/client';
export declare class ExploreMusiciansQueryDto {
    instrument?: string;
    style?: string;
    city?: string;
    gender?: Gender;
    experienceMin?: number;
    experienceMax?: number;
}
