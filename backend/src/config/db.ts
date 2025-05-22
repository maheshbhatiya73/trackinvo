import mongoose, { Connection } from 'mongoose';

class Database {
    private uri: string;
    private connection: Connection | null = null;

    constructor(uri: string) {
        this.uri = uri;
    }

    public async connect(): Promise<void> {
        try {
            await mongoose.connect(this.uri);
    
            this.connection = mongoose.connection;
            
            this.connection.on('error', (err) => console.error('MongoDB Connection Error:', err));
            this.connection.once('open', () => console.log(`Database connected to ${this.uri}`));
    
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;    
        }
    }
    

    public getConnection(): Connection {
        if (!this.connection) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.connection;
    }

    public async close(): Promise<void> {
        if (this.connection) {
            await mongoose.disconnect();
            console.log('Database connection closed');
            this.connection = null;
        }
    }
}

export default Database;