
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseConnection } from './config/database.js';
import { SocketManager } from './services/SocketManager.js';
 
import routes from './routes/v1/index.js'

dotenv.config();

class DeliveryTrackingServer {
    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });
        this.port = process.env.PORT || 5000;
        this.socketManager = new SocketManager(this.io);
    }

    async initialize() {
        await this.setupDatabase();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocketHandlers();
        this.startServer();
    }

    async setupDatabase() {
        try {
            await DatabaseConnection.connect();
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Database connection failed:', error);
            process.exit(1);
        }
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    setupRoutes() {
        this.app.use('/api/v1', routes);
    }

    setupSocketHandlers() {
        this.socketManager.initialize();
    }

    startServer() {
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

const server = new DeliveryTrackingServer();
server.initialize();