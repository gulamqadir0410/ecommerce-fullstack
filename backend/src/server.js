import express from 'express';

const app = express();

app.get('/api',(req,res)=>{
    res
    .status(200)
    .json({message:"success"})
});

app.listen(3000,()=>{
    console.log("Server is Running Now")
});
