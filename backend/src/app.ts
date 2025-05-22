import express, { Express, Request, Response } from 'express';
import Database from './config/db';
import cors from 'cors';
import SuperAdminRoute from './routes/SuperAdminRoute';
import checksuperadmin from './utils/checksuperadmin';
import authRoutes from './routes/authRoutes';
import categoryRouter from './routes/CategoryRoute';
import unitRouter from './routes/UnitRoute';
import productRouter from './routes/ProductRoute';
import customerRouter from './routes/CustomerRoute';
import invoiceRouter from './routes/InvoiceRoute';
import path from 'path';
import QuotationRoute from './routes/QuotationRoute';
import 'dotenv/config';

class App {
    private app: Express;
    private port: number = Number(process.env.PORT) || 8080;
    private db: Database;

    constructor() {
        this.app = express();
        const uri = process.env.MONGODB_URI || "localhost";
        this.db = new Database(uri);
        this.configureMiddleware();
        this.configureRoutes();
    }

    private configureMiddleware(): void {
        this.app.use(cors({
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));

        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        const uploadsPath = path.resolve(__dirname, '../uploads');
        console.log('Serving uploads from:', uploadsPath); 
        this.app.use('/uploads', express.static(uploadsPath));
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
        this.app.use('/api/superadmin', SuperAdminRoute);
        this.app.use('/api/categories', categoryRouter);
        this.app.use('/api/units', unitRouter);
        this.app.use('/api/products', productRouter);
        this.app.use('/api/customers', customerRouter);
        this.app.use('/api/invoices', invoiceRouter);
        this.app.use('/api/quotation', QuotationRoute)
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
