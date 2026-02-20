import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import { sendEmail } from "../utils/sendEmail.js";
// from node.js it gives token for few minutes
import crypto from "crypto";

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).send("User has been created");
  } catch (err) {
    // res.status(500).send("Something went wrong");
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    // const err = new Error();
    // err.status = 404;
    // err.message = "User does not exist";
    if (!user) {
      // return res.status(404).send("User does not exist");
      return next(createError(404, "User does not exist"));
    }

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) {
      // return res.status(404).send("Wrong password and username");
      return next(createError(404, "Wrong password and username"));
    }

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_SECRET
    );

    // this is done to seperate the password from rest of the data
    const { password, ...info } = user._doc;

    // res.cookie("accessToken", token).status(200).send(info);

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, 
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

// WE USE SAME SITE TO BC THE PORTS ARE DIFFERENT IN CLIENT AND SERVER
export const logout = async(req,res, next) => {
  res.clearCookie('accessToken' , {
      sameSite : "none",
      source : true
  }).status(200).send("User has been Logged out")
}

export const forgetPassword = async(req, res, next) => {
  try{
    const user = await User.findOne({
        email: req.body.email
    })
    if(!user) return next(createError(404, "User not found!"));

    // Generate a random tokken
    const resetToken = crypto.randomBytes(20).toString("hex");


    // Hash the token and save it to DB (Security Best Pactice)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // token expires in 10 min
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
    
    await user.save();

    // create the reset URL (points to your React frontend)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    const message = `
        <h1>Password Reset Request</h1>
        <p>You have requested a password reset. Click the link below to reset it:</p>
        <a href=${resetUrl} clicktracking="off">${resetUrl}</a>
        <p>This link expires in 10 mins</p>
    `

    try{
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message
        })

        res.status(200).send("Email sent successfully");
        console.log(message)
    }catch(err){
        // if email fails clear the fields so that the user can send again
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return next(createError(500, "Email could not be sent."));
    }


}catch(err){
    next(err)
}
}

export const resetPassword = async(req, res, next) => {
  try{
    // hash the token from the URL to compare with DB
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.body.token)
      .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()}
    })

    if(!user) return next(createError(400, 'Invalid or expired tokken'));

    // hash the new PW
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    // clear the fields after the PW is reset
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    res.status(200).send("Password has been reset successfully");
}catch(err){
    next(err)
}
}