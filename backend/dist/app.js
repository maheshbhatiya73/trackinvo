"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const express_1 = __importDefault(require("express"));
class App {
    constructor() {
        this.port = 8080;
        this.app = (0, express_1.default)();
        this.configureMiddleware();
        this.configureRoutes();
    }
    configureMiddleware() {
        this.app.use(express_1.default.json());
    }
    configureRoutes() {
        this.app.get('/', (req, res) => {
            res.status(200).json({
                message: 'TrackingVO Running API',
                status: 'success',
                timestamp: new Date().toISOString()
            });
        });
        this.app.get('/api/status', (req, res) => {
            res.status(200).json({
                message: 'API is running',
                status: 'active',
                uptime: process.uptime()
            });
        });
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`);
        });
    }
}
exports.default = App;
