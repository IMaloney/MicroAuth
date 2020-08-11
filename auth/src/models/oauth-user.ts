import mongoose from 'mongoose';


// necessity for different collections depends solely on the likelihood of ids in different dbs being equal
interface oauthUserAttrs {
    oauthId: string;
}

interface oauthUserModel extends mongoose.Model<oauthUserDoc> {
    build(attrs: oauthUserAttrs): oauthUserDoc;
}

interface oauthUserDoc extends mongoose.Document {
    oauthId: string;
}

const oauthSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
        versionKey: false
    }
   }
);

const OauthUser = mongoose.model<oauthUserDoc, oauthUserModel>('OauthUser', oauthSchema);

export {OauthUser };