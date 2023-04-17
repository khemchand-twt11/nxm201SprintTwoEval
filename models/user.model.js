const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
name:{
      type:String,
      required:true,
},
email:{
      type:String,
      required:true,
},
pass:{
      type:String,
      required:true,
},
role: {
      type:String,
      enum:['User','Moderator'],
      default:'User'
}
},{versionKey:false})

const userModel = mongoose.model('User',userSchema);
module.exports ={userModel}