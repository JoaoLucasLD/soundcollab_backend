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
        const origin = await this.resolveDistanceOrigin(userId, filters);
        const profiles = await this.exploreRepository.findMusicians({
            excludeUserId: userId,
            ...filters,
        });
        const musicians = profiles
            .map((profile) => ({
            profile,
            distanceKm: origin
                ? calculateDistanceKm(origin, {
                    latitude: profile.latitude,
                    longitude: profile.longitude,
                })
                : null,
        }))
            .filter((item) => {
            if (!origin || filters.radiusKm === undefined) {
                return true;
            }
            return item.distanceKm !== null && item.distanceKm <= filters.radiusKm;
        })
            .sort((firstItem, secondItem) => {
            if (firstItem.distanceKm === null && secondItem.distanceKm === null) {
                return firstItem.profile.displayName.localeCompare(secondItem.profile.displayName);
            }
            if (firstItem.distanceKm === null) {
                return 1;
            }
            if (secondItem.distanceKm === null) {
                return -1;
            }
            return firstItem.distanceKm - secondItem.distanceKm;
        })
            .map(({ profile, distanceKm }) => {
            const birthDate = (0, profile_birth_date_crypto_1.decryptBirthDate)(profile.birthDateEncrypted);
            return {
                id: profile.id,
                userId: profile.userId,
                displayName: profile.displayName,
                city: profile.city,
                gender: profile.gender,
                age: (0, profile_birth_date_crypto_1.calculateAge)(birthDate),
                distanceKm: distanceKm === null ? null : Math.round(distanceKm),
                experience: profile.experience,
                bio: profile.bio,
                preferences: profile.preferences,
                collaborationGoals: profile.collaborationGoals,
                availabilityPeriods: profile.availabilityPeriods,
                availabilityTimes: profile.availabilityTimes,
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
            latitude: query.latitude,
            longitude: query.longitude,
            radiusKm: query.radiusKm,
            experienceMin: query.experienceMin,
            experienceMax: query.experienceMax,
        };
    }
    async resolveDistanceOrigin(userId, filters) {
        if (filters.radiusKm === undefined) {
            return null;
        }
        if ((filters.latitude === undefined) !==
            (filters.longitude === undefined)) {
            throw new common_1.BadRequestException('latitude and longitude must be provided together');
        }
        if (filters.latitude !== undefined && filters.longitude !== undefined) {
            return {
                latitude: filters.latitude,
                longitude: filters.longitude,
            };
        }
        const profileLocation = await this.exploreRepository.findProfileLocation(userId);
        if ((profileLocation === null || profileLocation === void 0 ? void 0 : profileLocation.latitude) === null ||
            (profileLocation === null || profileLocation === void 0 ? void 0 : profileLocation.latitude) === undefined ||
            profileLocation.longitude === null ||
            profileLocation.longitude === undefined) {
            throw new common_1.BadRequestException('Profile location is required to filter by distance');
        }
        return {
            latitude: profileLocation.latitude,
            longitude: profileLocation.longitude,
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
function calculateDistanceKm(origin, destination) {
    if (destination.latitude === null || destination.longitude === null) {
        return null;
    }
    const earthRadiusKm = 6378;
    const latitudeDelta = toRadians(destination.latitude - origin.latitude);
    const longitudeDelta = toRadians(destination.longitude - origin.longitude);
    const originLatitude = toRadians(origin.latitude);
    const destinationLatitude = toRadians(destination.latitude);
    const haversine = Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(originLatitude) *
            Math.cos(destinationLatitude) *
            Math.sin(longitudeDelta / 2) ** 2;
    return (2 *
        earthRadiusKm *
        Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)));
}
function toRadians(value) {
    return (value * Math.PI) / 180;
}
//# sourceMappingURL=explore.service.js.map