import mongoose from 'mongoose';
import { userInfo } from 'os';

// separating id values out because they could possibly be the same for different people
interface oauthUserAttrs {
    email: string;
    firstName: string;
    lastName: string;
}

interface oauthUserModel extends mongoose.Model<oauthUserDoc> {
    build(attrs: oauthUserAttrs): oauthUserDoc;
}

interface oauthUserDoc extends mongoose.Document {
    facebookId: string;
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
}

const oauthSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }, 
    facebookId: {
        type: String,
        required: false
    }, 
    googleId: {
        type: String,
        required: false
    }, 
    firstName: {
        type: String,
        required: true
    }, 
    lastName: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            if (ret.googleId) { delete ret.googleId; }
            if (ret.facebookId) { delete ret.facebookId; }
            
        },
        versionKey: false
    }
   }
);

const OauthUser = mongoose.model<oauthUserDoc, oauthUserModel>('oauth-users', oauthSchema);

export { OauthUser };