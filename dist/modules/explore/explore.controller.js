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
exports.ExploreController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const explore_musicians_query_dto_1 = require("./dto/explore-musicians-query.dto");
const explore_service_1 = require("./explore.service");
let ExploreController = class ExploreController {
    constructor(exploreService) {
        this.exploreService = exploreService;
    }
    listMusicians(req, query) {
        return this.exploreService.listMusicians(req.user.userId, query);
    }
};
exports.ExploreController = ExploreController;
__decorate([
    (0, common_1.Get)('musicians'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, explore_musicians_query_dto_1.ExploreMusiciansQueryDto]),
    __metadata("design:returntype", Promise)
], ExploreController.prototype, "listMusicians", null);
exports.ExploreController = ExploreController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('explore'),
    __metadata("design:paramtypes", [explore_service_1.ExploreService])
], ExploreController);
//# sourceMappingURL=explore.controller.js.map