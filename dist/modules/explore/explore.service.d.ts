import { ExploreMusiciansResponseDto } from './dto/explore-musician-response.dto';
import { ExploreMusiciansQueryDto } from './dto/explore-musicians-query.dto';
import { ExploreRepository } from './explore.repository';
export declare class ExploreService {
    private readonly exploreRepository;
    constructor(exploreRepository: ExploreRepository);
    listMusicians(userId: string, query: ExploreMusiciansQueryDto): Promise<ExploreMusiciansResponseDto>;
    private normalizeFilters;
    private normalizeOptionalText;
}
