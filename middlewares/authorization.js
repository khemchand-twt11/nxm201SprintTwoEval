const authorization = (role_array)=>{
 try {
      return (req,res,next)=>{
            const role = req.role;
        if(role_array.includes(role))
        {
            return next();
        }
        else{
            res.status(200).json({msg:"You are not authorized"});
        }
      } 
 } catch (error) {
      console.log(error.message)
      // res.status(400).json({error:error.message})
 }

}

module.exports ={authorization}