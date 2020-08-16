import mongoose from 'mongoose';
import { app } from './app';


const start = async () => {
    try {
        // connect to db
        await mongoose.connect(process.env.DB_LINK, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('connected to db');
    // exit if you can't connect to the db
    } catch(err) {
        console.log(err);
        process.exit();
    } 
    app.listen(process.env.PORT, () => {
        console.log('listening on port', process.env.PORT);
    });
};

start();