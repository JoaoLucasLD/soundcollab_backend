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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const update_my_profile_dto_1 = require("./dto/update-my-profile.dto");
const update_profile_instruments_dto_1 = require("./dto/update-profile-instruments.dto");
const update_profile_styles_dto_1 = require("./dto/update-profile-styles.dto");
const profiles_service_1 = require("./profiles.service");
let ProfilesController = class ProfilesController {
    constructor(profilesService) {
        this.profilesService = profilesService;
    }
    updateMyProfile(req, body) {
        return this.profilesService.upsertMyProfile(req.user.userId, body);
    }
    addMyInstruments(req, body) {
        return this.profilesService.addMyInstruments(req.user.userId, body);
    }
    addMyStyles(req, body) {
        return this.profilesService.addMyStyles(req.user.userId, body);
    }
};
exports.ProfilesController = ProfilesController;
__decorate([
    (0, common_1.Patch)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_my_profile_dto_1.UpdateMyProfileDto]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Post)('me/instruments'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_instruments_dto_1.UpdateProfileInstrumentsDto]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "addMyInstruments", null);
__decorate([
    (0, common_1.Post)('me/styles'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_styles_dto_1.UpdateProfileStylesDto]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "addMyStyles", null);
exports.ProfilesController = ProfilesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('profiles'),
    __metadata("design:paramtypes", [profiles_service_1.ProfilesService])
], ProfilesController);
//# sourceMappingURL=profiles.controller.js.map