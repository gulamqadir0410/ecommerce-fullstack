import mongoose from 'mongoose';

import {ENV} from './env.js';

export const connectDB = async()=>{
    try{
        await mongoose.connect(ENV.MONGODB_URI);
        console.log("DB CONNECTION ESTABLISHED")
    }
    catch(error){
        console.log(`DB CONN Error happend:`);
        console.log(error);
        
    }
}