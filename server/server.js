import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoDb.js";
import userRoute from "./routes/userRoutes.js";
import authRoute from "./routes/authRoutes.js";
import gigRoute from "./routes/gigRoutes.js";
import reviewRoute from "./routes/reviewRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

//MIDDLEWARE
app.use(express.json());

// THIS IS DONE SO THAT WE CAN SEND COOKIES IN THE REQUESTS FROM EXPRESS APP
app.use(cookieParser());

// CORS IS FOR US TO CONNECT WITH THE CLIENT SIDE
// YOU HAVE TO SET CREDENTIALS: TRUE TO PASS COOKIES FROM CLIENT TO SERVER
app.use(cors({origin: "https://hirely-test-t7hx.vercel.app", credentials: true}))
// app.use(
//     cors({
//       origin: true,
//       credentials: true,
//     })
//   );
  
 
app.get('/', (req, res) => {
    res.send("API is working")
})

// this middleware is only for api/user not work on every request
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/reviews", reviewRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    res.status(errorStatus).send(errorMessage);
  });

// FOR STARTING THE SERVER
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

connectDB();
