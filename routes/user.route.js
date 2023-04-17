const express = require("express");
const { userModel } = require("../models/user.model");
const userRoute = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { blacklistModel } = require("../models/blacklist");
require("dotenv").config();
//  REGISTRATION
userRoute.post("/add",async(req,res)=>{
      
  const {name,email,pass,role} = req.body;

 try {
      const ifUserExists = await userModel.findOne({email});
  if(ifUserExists)
  {
      res.status(400).json({msg:"user already exists,please login"});

  } 
  else{
      const hashedpass =await bcrypt.hash(pass,8)
      const newUser = new userModel({name,email,pass:hashedpass,role});
      await newUser.save();
      res.status(200).json({msg:"user registered successfully"});
  }
 } catch (error) {
      res.status(400).json({error:error.message});
 }
})

//LOGIN
userRoute.post("/login",async(req,res)=>{
const {email,pass} = req.body;
try {
    const ifUserExists = await userModel.findOne({email});
    if(!ifUserExists)
    {
      res.status(400).json({msg:"User doesn't exists with this email"});

    } 
    else{
      let result = await bcrypt.compare(pass,ifUserExists.pass);
      if(result)
      {
            let atoken = jwt.sign({userId:ifUserExists._id,role:ifUserExists.role},process.env.SECRET_ACCESSKEY,{expiresIn:"50m"});
            let rtoken = jwt.sign({userId:ifUserExists._id,role:ifUserExists.role},process.env.SECRET_REFERSSHKEY,{expiresIn:"12m"});
            res.status(200).json({msg:"login successfull!",AccessToken:atoken,RefershToken:rtoken})
      }
      else{
            res.status(400).json({msg:"something went wrong"});
      }
    } 
} catch (error) {
      res.status.json({error:error.message})
}
})

// GET NEW TOKEN
userRoute.get("/newtoken",async(req,res)=>{
  const token = req.headers.authorization.split(" ")[1];
  if(!token)
  {
       req.status.json({msg:"please pass valid token"});
  } 
  else{
      try {
            const decoded = jwt.verify(token,process.env.SECRET_REFERSSHKEY)
             if(decoded)
             {
                  let newtoken = jwt.sign({userId:ifUserExists._id,role:ifUserExists.role},process.env.SECRET_ACCESSKEY,{expiresIn:"1m"});
                  res.status(200).json({msg:"token created successfully!",newToken:newtoken}); 
             }
             
      } catch (error) {
            res.status(400).json({error:error.message});
      }
     
  } 
})

// LOGOUT
userRoute.get("/logout", async(req,res)=>{
      try {
            const token = req.headers.authorization.split(" ")[1];
            const blacklistToken = new blacklistModel({token});
            await blacklistToken.save();   
            res.status(200).json({msg:"Logout Successfully!"})
      } catch (error) {
            res.status.json({error:error.message})
      }
 
})
module.exports ={userRoute};