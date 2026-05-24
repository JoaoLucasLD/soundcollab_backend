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
exports.ProfilesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ProfilesRepository = class ProfilesRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findByUserId(userId) {
        return this.prisma.profile.findUnique({
            where: { userId },
            include: {
                instruments: true,
                styles: true,
            },
        });
    }
    findById(profileId) {
        return this.prisma.profile.findUnique({
            where: { id: profileId },
            include: {
                instruments: true,
                styles: true,
            },
        });
    }
    create(params) {
        return this.prisma.profile.create({
            data: {
                userId: params.userId,
                displayName: params.displayName,
                city: params.city,
                latitude: params.latitude,
                longitude: params.longitude,
                gender: params.gender,
                birthDateEncrypted: params.birthDateEncrypted,
                experience: params.experience,
                preferences: params.preferences,
                bio: params.bio,
                collaborationGoals: params.collaborationGoals,
                availabilityPeriods: params.availabilityPeriods,
                availabilityTimes: params.availabilityTimes,
                availabilityNotes: params.availabilityNotes,
            },
            include: {
                instruments: true,
                styles: true,
            },
        });
    }
    updateById(profileId, data) {
        return this.prisma.profile.update({
            where: { id: profileId },
            data,
            include: {
                instruments: true,
                styles: true,
            },
        });
    }
    findInstrumentsByIds(instrumentIds) {
        return this.prisma.instrument.findMany({
            where: {
                id: {
                    in: instrumentIds,
                },
            },
        });
    }
    findStylesByIds(styleIds) {
        return this.prisma.style.findMany({
            where: {
                id: {
                    in: styleIds,
                },
            },
        });
    }
    addInstrumentIds(profileId, instrumentIds) {
        return this.prisma.profile.update({
            where: { id: profileId },
            data: {
                instruments: {
                    connect: instrumentIds.map((id) => ({ id })),
                },
            },
            include: {
                instruments: true,
                styles: true,
            },
        });
    }
    setInstrumentIds(profileId, instrumentIds) {
        return this.prisma.profile.update({
            where: { id: profileId },
            data: {
                instruments: {
                    set: instrumentIds.map((id) => ({ id })),
                },
            },
            include: {
                instruments: true,
                styles: true,
            },
        });
    }
    removeInstrumentIds(profileId, instrumentIds) {
        return this.prisma.profile.update({
            where: { id: profileId },
            data: {
                instruments: {
                    disconnect: instrumentIds.map((id) => ({ id })),
                },
            },
            include: {
                instruments: true,
                styles: true,
            },
        });
    }
    addStyleIds(profileId, styleIds) {
        return this.prisma.profile.update({
            where: { id: profileId },
            data: {
                styles: {
                    connect: styleIds.map((id) => ({ id })),
                },
            },
            include: {
                instruments: true,
                styles: true,
            },
        });
    }
    setStyleIds(profileId, styleIds) {
        return this.prisma.profile.update({
            where: { id: profileId },
            data: {
                styles: {
                    set: styleIds.map((id) => ({ id })),
                },
            },
            include: {
                instruments: true,
                styles: true,
            },
        });
    }
    removeStyleIds(profileId, styleIds) {
        return this.prisma.profile.update({
            where: { id: profileId },
            data: {
                styles: {
                    disconnect: styleIds.map((id) => ({ id })),
                },
            },
            include: {
                instruments: true,
                styles: true,
            },
        });
    }
};
exports.ProfilesRepository = ProfilesRepository;
exports.ProfilesRepository = ProfilesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfilesRepository);
//# sourceMappingURL=profiles.repository.js.map