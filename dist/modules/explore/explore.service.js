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
exports.ExploreService = void 0;
const common_1 = require("@nestjs/common");
const explore_repository_1 = require("./explore.repository");
const profile_birth_date_crypto_1 = require("../profiles/profile-birth-date.crypto");
let ExploreService = class ExploreService {
    constructor(exploreRepository) {
        this.exploreRepository = exploreRepository;
    }
    async listMusicians(userId, query) {
        const filters = this.normalizeFilters(query);
        if (filters.experienceMin !== undefined &&
            filters.experienceMax !== undefined &&
            filters.experienceMin > filters.experienceMax) {
            throw new common_1.BadRequestException('experienceMin must be less than or equal to experienceMax');
        }
        const profiles = await this.exploreRepository.findMusicians({
            excludeUserId: userId,
            ...filters,
        });
        const musicians = profiles.map((profile) => {
            const birthDate = (0, profile_birth_date_crypto_1.decryptBirthDate)(profile.birthDateEncrypted);
            return {
                id: profile.id,
                userId: profile.userId,
                displayName: profile.displayName,
                city: profile.city,
                gender: profile.gender,
                age: (0, profile_birth_date_crypto_1.calculateAge)(birthDate),
                experience: profile.experience,
                preferences: profile.preferences,
                instruments: profile.instruments.map((item) => item.name),
                styles: profile.styles.map((item) => item.name),
            };
        });
        return {
            musicians,
            total: musicians.length,
        };
    }
    normalizeFilters(query) {
        var _a, _b;
        const instrument = (_a = this.normalizeOptionalText(query.instrument)) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const style = (_b = this.normalizeOptionalText(query.style)) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        const city = this.normalizeOptionalText(query.city);
        const gender = query.gender;
        return {
            instrument,
            style,
            city,
            gender,
            experienceMin: query.experienceMin,
            experienceMax: query.experienceMax,
        };
    }
    normalizeOptionalText(value) {
        if (value === undefined) {
            return undefined;
        }
        const normalized = value.trim();
        return normalized.length > 0 ? normalized : undefined;
    }
};
exports.ExploreService = ExploreService;
exports.ExploreService = ExploreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [explore_repository_1.ExploreRepository])
], ExploreService);
//# sourceMappingURL=explore.service.js.map