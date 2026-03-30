import express from "express"
import mongoose from "mongoose";
const app=express();
const url="";

connectDB().then(()=>{
    console.log("connected to db");
}).catch(()=>{
    console.error("error connecting to db");
    process.exit(1);
});

async function connectDB(){
    await mongoose.connect(url);
}

app.listen(3000,()=>{
    console.log("app is running on port 3000");
})