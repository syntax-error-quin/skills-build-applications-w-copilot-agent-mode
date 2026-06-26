"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';
async function connectDatabase() {
    if (mongoose_1.default.connection.readyState >= 1) {
        return mongoose_1.default.connection;
    }
    return mongoose_1.default.connect(mongoUri);
}
