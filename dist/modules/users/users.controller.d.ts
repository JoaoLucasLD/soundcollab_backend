import { RequestWithUser } from '../auth/interfaces/authenticated-user.interface';
import { MeResponseDto } from './dto/me-response.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: RequestWithUser): Promise<MeResponseDto>;
}
