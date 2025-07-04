//register,login,logout

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register=async(req,res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.json({success:false, message:"Missing details"});
    }

    try{

        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false, message:"User already exists"});
        }

        const hashedPassword=await bcrypt.hash(password, 10);

        const user=new userModel({name, email, password:hashedPassword});
        await user.save();


        //creating cookie
        const token=jwt.sign({id: user._id}, process.env.JWT_SECRET ,{expiresIn:'7d'} );
        res.cookie('token', token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?
            'none':'strict',
            maxAge:7*24*60*60*1000
        });

        //SENDING WELCOME EMAIL
        const mail_options={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'Welcome to Great Stack',
            email:`Welcome your account has been created by the email ${email}1`,

         };
         
         await transporter.sendMail(mail_options);

        return res.json({success:true});

    }
    catch(error){
        res.json({success:false, message:error.message})
    }
}


export const login = async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.json({success:false, message:'Email and password are required'});
    }

    try{

        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:'invalid email'});
        }
        
        const isMatch=await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success:false, message:'Invalid Password'})
        }

        const token=jwt.sign({id: user._id}, process.env.JWT_SECRET ,{expiresIn:'7d'} );
        res.cookie('token', token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?
            'none':'strict',
            maxAge:7*24*60*60*1000
        });

        return res.json({success:true});

    }
    catch(error){
        return res.json({success:false, message:error.message});
    }
}

export const logout = async(req,res)=>{
    try{

        //clearing cookie
        res.clearCookie('token', {
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?
            'none':'strict',
            maxAge:7*24*60*60*1000

        });

        return res.json({success:true, message:'Logged out'});
    }
    catch(error){
        return res.json({success:false, message:error.message});
    }
}

export  const  sendVerifyOtp= async(req,res)=>{
    try{
        const {userId}=req.body;
        const user=await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success:false, message:"account already verified"});
        }
        
        const otp=String(Math.floor(Math.random()*900000+100000));
        user.verifyOtp=otp;
        user.verifyOtpExpireAt=Date.now()+24*60*60*1000;
        await user.save();
        
        //send mail
        const mailOption={
            from:'gera.shaina@gmail.com',
            to:user.email,
            subject:'Account verification OTP',
            text:`Your OTP is ${otp}`,
        }
        await transporter.sendMail(mailOption);

        res.json({success:true,message:"OTP sent"});
    }
    catch(error){
        res.json({success:false, message:error.message})

    }
}

export const verifyEmail = async(req,res) =>{
    const {userId,otp} =req.body;
    if(!userId || !otp){
        return res.json({success:false, message:"Missing  Details"});
    }
    try{
        const user=await userModel.findById(userId);

        if(!user){
            return res.json({success:false, message:'User not found'});
        }
        
        if(user.verifyOtp==='' || user.verifyOtp !== otp){
            return res.json({success:false, message:'Invalid message'});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json ({success:false, message:'OTP Expired'});
        }

        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;

        await user.save();
        return res.json ({success:true, message:'Email verified succesfully'});
    }
    catch(error){
        return res.json({success:false, message:error.message});
    }
}

//middleware works before this
export const isAuthenticated =async(req,res)=>{
    try{
        return res.json({success:true});
    }
    catch(error){
        res.json({success:false, message:eror.message});
    }
}

//send password reset otp
export const sendResetOtp=async(req,res)=>{
    const {email}=req.body;

    if(!email){
        return res.json({success:false, message:"Email is required"});
    }
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"user not found"});
        }

        const otp=String(Math.floor(Math.random()*900000+100000));
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now()+15*60*1000;
        await user.save();
        
        //send mail
        const mailOption={
            from:'gera.shaina@gmail.com',
            to:user.email,
            subject:'Password reset OTP',
            text:`Your OTP is ${otp}`,
        }
        await transporter.sendMail(mailOption);

        return res.json({success:true, message:'otp sent to your mail'});
    }
    catch(error){
        return res.json({success:false, message:error.message})
    }
}

//reset password
export const resetPassword=async(req,res)=>{
    const {email,otp,newPassword} = req.body;

    if(!email || !otp || !password){
        return res.json({success:false, message:'Enter all details'});
    }

    try{

        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:'User not found'});
        }

        if(user.resetOtp='' || user.resetOtp!== otp){
            return res.json({success:false, message:'invalid otp'});
        }

        if(user.resetOtpExpireAt<Date.now()){
            return res.json({success:false, messgae:'otp expired'});
        }

        const hashedPassword= await bcrypt.hash(newPassword,10);

        user.password=hashedPassword;
        user.restOtp='';
        user.resetOtpExpireAt=0;

        await user.save();

        return res.json({success:true, message:"password has been changed successfully"});

    }
    catch(error){
        return res.json({success:false, message:error.message});
    }
}