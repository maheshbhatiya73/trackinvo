import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'superadmin';
    status: "active" | 'inactive';
    avatar: string;
    lastLogin: string;
    
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
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: 'active'
    },
    avatar: { type: String, required: false },
    lastLogin: { type: String, required: false },
}, {
    timestamps: true
});

UserSchema.statics.createDefaultSuperadmin = async function () {
    try {
        const superadminExists = await this.findOne({ role: 'superadmin' });
        if (!superadminExists) {
            const hashedPassword = await bcrypt.hash('superadmin123', 10);

            const superadmin = new this({
                username: 'super admin',
                email: 'superadmin@gmail.com',
                password: hashedPassword,
                role: 'superadmin',
                status: "active"
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