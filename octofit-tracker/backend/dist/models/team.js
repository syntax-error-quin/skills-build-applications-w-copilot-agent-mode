"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = require("mongoose");
const teamSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    sport: { type: String, required: true },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    captain: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    goal: { type: String, required: true },
}, { timestamps: true });
exports.Team = (0, mongoose_1.model)('Team', teamSchema);
