"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaborationsModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const collaborations_controller_1 = require("./collaborations.controller");
const collaborations_repository_1 = require("./collaborations.repository");
const collaborations_service_1 = require("./collaborations.service");
let CollaborationsModule = class CollaborationsModule {
};
exports.CollaborationsModule = CollaborationsModule;
exports.CollaborationsModule = CollaborationsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [collaborations_controller_1.CollaborationsController],
        providers: [collaborations_service_1.CollaborationsService, collaborations_repository_1.CollaborationsRepository],
    })
], CollaborationsModule);
//# sourceMappingURL=collaborations.module.js.map