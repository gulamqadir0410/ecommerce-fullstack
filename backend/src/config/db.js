import mongoose from 'mongoose';

import {ENV} from './env.js';

export const connectDB = async()=>{
    try{
        await mongoose.connect(ENV.DB_URL);
        console.log("DB CONNECTION ESTABLISHED")
    }
    catch(error){
        console.log(`DB CONN Error happend:`);
        console.log(error);
        
    }
}