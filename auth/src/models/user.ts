import mongoose from 'mongoose';
import { hash } from '../services/password';

interface userAttrs {
    email: string;
    password: string;
    firstName: string; 
    lastName: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: userAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    firstName: {
        type: String,
        required: true
    }, 
    lastName: {
        type: String,
        required: true
    }, 
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                // TODO: may also remove first and last name in request as well
            }, 
            versionKey: false
        }
    }
);

userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await hash(this.get('password'));
        this.set('password', hashed);
    }
    done();   
});

const User = mongoose.model<UserDoc, UserModel>("user", userSchema);

export { User };