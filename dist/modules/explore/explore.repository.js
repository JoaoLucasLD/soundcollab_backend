"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExploreRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ExploreRepository = class ExploreRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findMusicians(filters) {
        const where = {
            userId: {
                not: filters.excludeUserId,
            },
        };
        if (filters.instrument) {
            where.instruments = {
                some: {
                    name: filters.instrument,
                },
            };
        }
        if (filters.style) {
            where.styles = {
                some: {
                    name: filters.style,
                },
            };
        }
        if (filters.city) {
            where.city = {
                equals: filters.city,
                mode: 'insensitive',
            };
        }
        if (filters.experienceMin !== undefined ||
            filters.experienceMax !== undefined) {
            const experienceFilter = {};
            if (filters.experienceMin !== undefined) {
                experienceFilter.gte = filters.experienceMin;
            }
            if (filters.experienceMax !== undefined) {
                experienceFilter.lte = filters.experienceMax;
            }
            where.experience = experienceFilter;
        }
        return this.prisma.profile.findMany({
            where,
            include: {
                instruments: true,
                styles: true,
            },
            orderBy: {
                displayName: 'asc',
            },
        });
    }
};
exports.ExploreRepository = ExploreRepository;
exports.ExploreRepository = ExploreRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExploreRepository);
//# sourceMappingURL=explore.repository.js.map