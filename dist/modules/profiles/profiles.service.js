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
const profile_birth_date_crypto_1 = require("./profile-birth-date.crypto");
const profiles_repository_1 = require("./profiles.repository");
let ProfilesService = class ProfilesService {
    constructor(profilesRepository) {
        this.profilesRepository = profilesRepository;
    }
    async getByUserId(userId) {
        const profile = await this.profilesRepository.findByUserId(userId);
        if (!profile) {
            throw new common_1.NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
        }
        return this.toResponse(profile);
    }
    async getById(profileId) {
        const profile = await this.profilesRepository.findById(profileId);
        if (!profile) {
            throw new common_1.NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
        }
        return this.toResponse(profile);
    }
    async upsertMyProfile(userId, input) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
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
                latitude: (_b = data.latitude) !== null && _b !== void 0 ? _b : null,
                longitude: (_c = data.longitude) !== null && _c !== void 0 ? _c : null,
                gender: (_d = data.gender) !== null && _d !== void 0 ? _d : null,
                birthDateEncrypted: (_e = data.birthDateEncrypted) !== null && _e !== void 0 ? _e : null,
                experience: (_f = data.experience) !== null && _f !== void 0 ? _f : null,
                preferences: (_g = data.preferences) !== null && _g !== void 0 ? _g : null,
                bio: (_h = data.bio) !== null && _h !== void 0 ? _h : null,
                collaborationGoals: (_j = data.collaborationGoals) !== null && _j !== void 0 ? _j : [],
                availabilityPeriods: (_k = data.availabilityPeriods) !== null && _k !== void 0 ? _k : [],
                availabilityTimes: (_l = data.availabilityTimes) !== null && _l !== void 0 ? _l : [],
                availabilityNotes: (_m = data.availabilityNotes) !== null && _m !== void 0 ? _m : null,
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
            throw new common_1.NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
        }
        const instrumentIds = this.normalizeIdList(input.instrumentIds, 'instrument');
        await this.ensureInstrumentsExist(instrumentIds);
        const updatedProfile = await this.profilesRepository.addInstrumentIds(profile.id, instrumentIds);
        return this.toResponse(updatedProfile);
    }
    async replaceMyInstruments(userId, input) {
        const profile = await this.profilesRepository.findByUserId(userId);
        if (!profile) {
            throw new common_1.NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
        }
        const instrumentIds = this.normalizeIdList(input.instrumentIds, 'instrument', {
            allowEmpty: true,
        });
        await this.ensureInstrumentsExist(instrumentIds);
        const updatedProfile = await this.profilesRepository.setInstrumentIds(profile.id, instrumentIds);
        return this.toResponse(updatedProfile);
    }
    async removeMyInstruments(userId, input) {
        const profile = await this.profilesRepository.findByUserId(userId);
        if (!profile) {
            throw new common_1.NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
        }
        const instrumentIds = this.normalizeIdList(input.instrumentIds, 'instrument');
        await this.ensureInstrumentsExist(instrumentIds);
        const updatedProfile = await this.profilesRepository.removeInstrumentIds(profile.id, instrumentIds);
        return this.toResponse(updatedProfile);
    }
    async addMyStyles(userId, input) {
        const profile = await this.profilesRepository.findByUserId(userId);
        if (!profile) {
            throw new common_1.NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
        }
        const styleIds = this.normalizeIdList(input.styleIds, 'style');
        await this.ensureStylesExist(styleIds);
        const updatedProfile = await this.profilesRepository.addStyleIds(profile.id, styleIds);
        return this.toResponse(updatedProfile);
    }
    async replaceMyStyles(userId, input) {
        const profile = await this.profilesRepository.findByUserId(userId);
        if (!profile) {
            throw new common_1.NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
        }
        const styleIds = this.normalizeIdList(input.styleIds, 'style', {
            allowEmpty: true,
        });
        await this.ensureStylesExist(styleIds);
        const updatedProfile = await this.profilesRepository.setStyleIds(profile.id, styleIds);
        return this.toResponse(updatedProfile);
    }
    async removeMyStyles(userId, input) {
        const profile = await this.profilesRepository.findByUserId(userId);
        if (!profile) {
            throw new common_1.NotFoundException('Perfil não encontrado para o usuário. Tente novamente.');
        }
        const styleIds = this.normalizeIdList(input.styleIds, 'style');
        await this.ensureStylesExist(styleIds);
        const updatedProfile = await this.profilesRepository.removeStyleIds(profile.id, styleIds);
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
        if ((input.latitude === undefined) !== (input.longitude === undefined)) {
            throw new common_1.BadRequestException('latitude and longitude must be provided together');
        }
        if (input.latitude !== undefined && input.longitude !== undefined) {
            data.latitude = input.latitude;
            data.longitude = input.longitude;
        }
        if (input.gender !== undefined) {
            data.gender = input.gender;
        }
        if (input.birthDate !== undefined) {
            const normalizedBirthDate = (0, profile_birth_date_crypto_1.normalizeBirthDate)(input.birthDate);
            data.birthDateEncrypted = (0, profile_birth_date_crypto_1.encryptBirthDate)(normalizedBirthDate);
        }
        if (input.experience !== undefined) {
            data.experience = input.experience;
        }
        if (input.preferences !== undefined) {
            data.preferences = this.normalizeNullableText(input.preferences);
        }
        if (input.bio !== undefined) {
            data.bio = this.normalizeNullableText(input.bio);
        }
        if (input.collaborationGoals !== undefined) {
            data.collaborationGoals = [...new Set(input.collaborationGoals)];
        }
        if (input.availabilityPeriods !== undefined) {
            data.availabilityPeriods = [...new Set(input.availabilityPeriods)];
        }
        if (input.availabilityTimes !== undefined) {
            data.availabilityTimes = [...new Set(input.availabilityTimes)];
        }
        if (input.availabilityNotes !== undefined) {
            data.availabilityNotes = this.normalizeNullableText(input.availabilityNotes);
        }
        return data;
    }
    normalizeNullableText(value) {
        if (value === null) {
            return null;
        }
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
    normalizeIdList(values, label, options = {}) {
        const normalizedValues = values
            .map((value) => value.trim())
            .filter((value) => value.length > 0);
        const uniqueValues = [...new Set(normalizedValues)];
        if (!options.allowEmpty && uniqueValues.length === 0) {
            throw new common_1.BadRequestException(`At least one valid ${label} id is required`);
        }
        return uniqueValues;
    }
    async ensureInstrumentsExist(instrumentIds) {
        if (instrumentIds.length === 0) {
            return;
        }
        const instruments = await this.profilesRepository.findInstrumentsByIds(instrumentIds);
        if (instruments.length !== instrumentIds.length) {
            throw new common_1.NotFoundException('One or more instruments were not found');
        }
    }
    async ensureStylesExist(styleIds) {
        if (styleIds.length === 0) {
            return;
        }
        const styles = await this.profilesRepository.findStylesByIds(styleIds);
        if (styles.length !== styleIds.length) {
            throw new common_1.NotFoundException('One or more styles were not found');
        }
    }
    toResponse(profile) {
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
            bio: profile.bio,
            collaborationGoals: profile.collaborationGoals,
            availabilityPeriods: profile.availabilityPeriods,
            availabilityTimes: profile.availabilityTimes,
            availabilityNotes: profile.availabilityNotes,
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