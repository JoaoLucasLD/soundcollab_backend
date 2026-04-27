import { PrismaService } from '../../database/prisma.service';
import { MeResponseDto } from './dto/me-response.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): Promise<MeResponseDto>;
}
