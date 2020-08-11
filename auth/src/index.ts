import mongoose from 'mongoose';
import { app } from './app';


const start = async () => {
    // try {
    //     await mongoose.connect(process.env.DB_LINK, {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //         useCreateIndex: true
    //     });
    //     console.log('connected to db');
    // } catch(err) {
    //     console.log(err);
    // } 
    // maybe change the port
    app.listen(process.env.PORT, () => {
        console.log('listening on port', process.env.PORT);
    });
};

start();