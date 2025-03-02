import express, { Express, Request, Response } from 'express';
import Database from './config/db';
import cors from 'cors';
import SuperAdminRoute from './routes/SuperAdminRoute';
import checksuperadmin from './utils/checkSuperadmin';
import authRoutes from './routes/authRoutes';

class App {
    private app: Express;
    private port: number = 8080;
    private db: Database;

    constructor() {
        this.app = express();
        const uri = "mongodb+srv://sparkvision73:trackinvo12@cluster0.a56ml.mongodb.net/trackinvo?retryWrites=true&w=majority&appName=Cluster0";
        this.db = new Database(uri);
        this.configureMiddleware();
        this.configureRoutes();
    }

    private configureMiddleware(): void {
        this.app.use(cors({
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        this.app.use(express.json());
    }

    private configureRoutes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.status(200).json({
                message: 'TrackingVO Running API',
                status: 'success',
                timestamp: new Date().toISOString(),
            });
        });
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/superadmin', SuperAdminRoute)
    }

    public async start(): Promise<void> {
        try {
            await this.db.connect();

            const dbConnection = this.db.getConnection();

            dbConnection.on('connected', async () => {
                console.log('Listening for database changes...');

                const collection = dbConnection.collection('users');

                const changeStream = collection.watch();

                changeStream.on('change', (change) => {
                    console.log('Change detected:', change);
                });
            });

            const hasSuperadmin = await checksuperadmin.checker();
            if (hasSuperadmin) {
                console.log('Superadmin exists');
            }

            this.app.listen(this.port, () => {
                console.log(`Server running on http://localhost:${this.port}`);
            });

        } catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}

export default App;