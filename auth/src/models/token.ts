import mongoose from 'mongoose';

interface tokenAttrs {
    userId: mongoose.Schema.Types.ObjectId;
    token: string;
}

interface TokenModel extends mongoose.Model<TokenDoc> {
    build(attrs: tokenAttrs): TokenDoc;
}

interface TokenDoc extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    token: string;
    createdAt: Date;
}

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    token: {
        type: String,
        required: true        
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        // 12 hours 
        expires: 43200
    }
}
);

const Token = mongoose.model<TokenDoc, TokenModel>('token', tokenSchema);

export { Token };