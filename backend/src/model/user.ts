import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'superadmin';
}

interface IUserModel extends Model<IUser> {
    createDefaultSuperadmin(): Promise<IUser | null>;
}

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user'
    }
}, {
    timestamps: true
});

UserSchema.statics.createDefaultSuperadmin = async function() {
    try {
        const superadminExists = await this.findOne({ role: 'superadmin' });
        if (!superadminExists) {
            const hashedPassword = await bcrypt.hash('mahesh123', 10);
            
            const superadmin = new this({
                username: 'mahesh bhatiya',
                email: 'maheshbhatiya304@gmail.com',
                password: hashedPassword,
                role: 'superadmin'
            });
            
            await superadmin.save();
            console.log('Default superadmin created');
            return superadmin;
        }
        return null;
    } catch (error) {
        console.error('Error creating default superadmin:', error);
        return null;
    }
};

export default mongoose.model<IUser, IUserModel>('User', UserSchema);