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
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const profiles_repository_1 = require("./profiles.repository");
let ProfilesService = class ProfilesService {
    constructor(profilesRepository) {
        this.profilesRepository = profilesRepository;
    }
    async upsertMyProfile(userId, input) {
        var _a, _b, _c;
        const existingProfile = await this.profilesRepository.findByUserId(userId);
        const data = this.normalizeProfileUpdate(input);
        if (!existingProfile) {
            if (!data.displayName) {
                throw new common_1.BadRequestException('displayName is required when creating profile');
            }
            const createdProfile = await this.profilesRepository.create({
                userId,
                displayName: data.displayName,
                city: (_a = data.city) !== null && _a !== void 0 ? _a : null,
                experience: (_b = data.experience) !== null && _b !== void 0 ? _b : null,
                preferences: (_c = data.preferences) !== null && _c !== void 0 ? _c : null,
            });
            return this.toResponse(createdProfile);
        }
        if (Object.keys(data).length === 0) {
            return this.toResponse(existingProfile);
        }
        const updatedProfile = await this.profilesRepository.updateById(existingProfile.id, data);
        return this.toResponse(updatedProfile);
    }
    async addMyInstruments(userId, input) {
        const profile = await this.profilesRepository.findByUserId(userId);
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        const instruments = this.normalizeTermList(input.instruments, 'instrument');
        const updatedProfile = await this.profilesRepository.addInstruments(profile.id, instruments);
        return this.toResponse(updatedProfile);
    }
    async addMyStyles(userId, input) {
        const profile = await this.profilesRepository.findByUserId(userId);
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        const styles = this.normalizeTermList(input.styles, 'style');
        const updatedProfile = await this.profilesRepository.addStyles(profile.id, styles);
        return this.toResponse(updatedProfile);
    }
    normalizeProfileUpdate(input) {
        const data = {};
        if (input.displayName !== undefined) {
            data.displayName = this.normalizeRequiredText(input.displayName, 'displayName');
        }
        if (input.city !== undefined) {
            data.city = this.normalizeNullableText(input.city);
        }
        if (input.experience !== undefined) {
            data.experience = input.experience;
        }
        if (input.preferences !== undefined) {
            data.preferences = this.normalizeNullableText(input.preferences);
        }
        return data;
    }
    normalizeNullableText(value) {
        const normalized = value.trim();
        return normalized.length > 0 ? normalized : null;
    }
    normalizeRequiredText(value, field) {
        const normalized = value.trim();
        if (normalized.length === 0) {
            throw new common_1.BadRequestException(`${field} cannot be empty`);
        }
        return normalized;
    }
    normalizeTermList(values, label) {
        const normalizedValues = values
            .map((value) => value.trim().toLowerCase())
            .filter((value) => value.length > 0);
        const uniqueValues = [...new Set(normalizedValues)];
        if (uniqueValues.length === 0) {
            throw new common_1.BadRequestException(`At least one valid ${label} is required`);
        }
        return uniqueValues;
    }
    toResponse(profile) {
        return {
            id: profile.id,
            userId: profile.userId,
            displayName: profile.displayName,
            city: profile.city,
            experience: profile.experience,
            preferences: profile.preferences,
            instruments: profile.instruments.map((item) => item.name),
            styles: profile.styles.map((item) => item.name),
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        };
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [profiles_repository_1.ProfilesRepository])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map