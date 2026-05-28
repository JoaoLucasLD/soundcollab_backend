"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchmakingModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const availability_match_strategy_1 = require("./strategies/availability-match.strategy");
const collaboration_goals_match_strategy_1 = require("./strategies/collaboration-goals-match.strategy");
const experience_match_strategy_1 = require("./strategies/experience-match.strategy");
const match_score_calculator_1 = require("./match-score-calculator");
const matchmaking_controller_1 = require("./matchmaking.controller");
const matchmaking_repository_1 = require("./matchmaking.repository");
const matchmaking_service_1 = require("./matchmaking.service");
const instrument_match_strategy_1 = require("./strategies/instrument-match.strategy");
const location_match_strategy_1 = require("./strategies/location-match.strategy");
const style_match_strategy_1 = require("./strategies/style-match.strategy");
let MatchmakingModule = class MatchmakingModule {
};
exports.MatchmakingModule = MatchmakingModule;
exports.MatchmakingModule = MatchmakingModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [matchmaking_controller_1.MatchmakingController],
        providers: [
            matchmaking_service_1.MatchmakingService,
            matchmaking_repository_1.MatchmakingRepository,
            match_score_calculator_1.MatchScoreCalculator,
            availability_match_strategy_1.AvailabilityMatchStrategy,
            collaboration_goals_match_strategy_1.CollaborationGoalsMatchStrategy,
            instrument_match_strategy_1.InstrumentMatchStrategy,
            style_match_strategy_1.StyleMatchStrategy,
            location_match_strategy_1.LocationMatchStrategy,
            experience_match_strategy_1.ExperienceMatchStrategy,
        ],
    })
], MatchmakingModule);
//# sourceMappingURL=matchmaking.module.js.map