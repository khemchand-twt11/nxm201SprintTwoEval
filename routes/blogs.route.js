const express = require("express");
const { blogModel } = require("../models/blogs.model");
const { authorization } = require("../middlewares/authorization");
const blogRoute = express.Router();

blogRoute.post("/add", async(req,res)=>{
  const {title,content,author} = req.body;
  const userId = req.userId;

  try {
  const newBlog = new blogModel({title,content,author,userId})
  await newBlog.save();
  res.status(200).json({msg:"blog created successfully!"})
      
  } catch (error) {
      res.status(400).json({error:error.message})
  }

})

// GET BLOGS
blogRoute.get("/", async(req,res)=>{
      console.log(req.role)
  const userId = req.userId;
 try {
     const blogs = await blogModel.find({userId});
     res.status(200).json({data:blogs});
 } catch (error) {
  res.status(400).json({error:error.message})
      
 }
})

// UPDATE BLOGS
blogRoute.put("/:id",async(req,res)=>{
 const userId = req.userId;
 try {
    const blog = await blogModel.findOne({_id:req.params.id});
    if(blog.userId ===userId)
    {
      const updatedBlog = await blogModel.findByIdAndUpdate({_id:req.params.id},{$set:req.body},{new:true}) 
      res.status(200).json({msg:"blog updated successfully",data:updatedBlog})
    }
    else{
      res.status(400).json({msg:"You are not authorized to update this blog"})

    }
  

 } catch (error) {
      
  res.status(400).json({error:error.message})
}
})


blogRoute.delete("/:id",async(req,res)=>{
      const userId = req.userId;
      try {
        const blog = await blogModel.findOne({_id:req.params.id});
        if(blog.userId === userId)
        {
              const deletedBlog = await blogModel.findByIdAndDelete({_id:req.params.id});
              res.status(200).json({msg:"blog Deleted successfully",data:deletedBlog})

        }
        else{
            res.status(400).json({msg:"You are not authorized to delete this blog"})

        }
      } catch (error) {
           
       res.status(400).json({error:error.message})
     }
})


     // DELETE BLOGS
blogRoute.delete("/moderator/:id",authorization(["Moderator"]),async(req,res)=>{
      
      try {
         const deletedBlog = await blogModel.findByIdAndDelete({_id:req.params.id});
              res.status(200).json({msg:"blog Deleted successfully",data:deletedBlog})
     
       } catch (error) {
           
       res.status(400).json({error:error.message})
     }
 })



module.exports ={blogRoute};