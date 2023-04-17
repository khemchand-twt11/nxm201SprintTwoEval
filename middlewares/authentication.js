const jwt = require("jsonwebtoken");
const { blacklistModel } = require("../models/blacklist");
const authentication = async(req,res,next)=>{
      const token = req.headers.authorization?.split(" ")[1];

      try {
       const IfBlaclistToken = await blacklistModel.findOne({token:token})
       if(IfBlaclistToken)
       {
            res.status(400).json({msg:"Your token has expired"});
       }
       else{
            let decoded = jwt.verify(token,process.env.SECRET_ACCESSKEY);
            req.userId = decoded.userId;
            req.role = decoded.role;
            next()
       }
      
      
      } catch (error) {
        res.status(400).json({error:error.message});     
      }
}
module.exports = {authentication};