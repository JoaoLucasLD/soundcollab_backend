import { RequestWithUser } from '../auth/interfaces/authenticated-user.interface';
import { ExploreMusiciansQueryDto } from './dto/explore-musicians-query.dto';
import { ExploreMusiciansResponseDto } from './dto/explore-musician-response.dto';
import { ExploreService } from './explore.service';
export declare class ExploreController {
    private readonly exploreService;
    constructor(exploreService: ExploreService);
    listMusicians(req: RequestWithUser, query: ExploreMusiciansQueryDto): Promise<ExploreMusiciansResponseDto>;
}
