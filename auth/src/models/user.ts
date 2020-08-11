import mongoose from 'mongoose';


interface userAttrs {
    email: string;
    password: string;
    name: string; 
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: userAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    name: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    name: {
        type: String,
        required: true
    }
});