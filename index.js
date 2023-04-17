const express = require("express");
const { connection } = require("./configs/db");
const { userRoute } = require("./routes/user.route");
const { blogRoute } = require("./routes/blogs.route");
const { authentication } = require("./middlewares/authentication");
const app = express();
require("dotenv").config();
app.use(express.json());

app.get("/",(req,res)=>{
      res.status(200).json({msg:"HOME PAGE"})
})
app.use("/user",userRoute);
app.use(authentication);
app.use("/blog",blogRoute);

app.listen(process.env.PORT,async()=>{
      try {
          await connection;  
      } catch (error) {
         console.log(error);   
      }
      console.log("server is running")
})
