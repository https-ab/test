import mongoose from "mongoose";

const connectDB = async() => {
    // the below line will executed when db connects
    mongoose.connection.on("connected", () => {
        console.log("DB is connected");
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/loginSignup`)
    //mongo connection
}

export default connectDB;