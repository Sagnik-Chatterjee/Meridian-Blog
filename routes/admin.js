const express=require("express")
const checkAuthorization=require("../middlewares/authorization")
const Blog=require("../models/blog")
const User=require("../models/user")
const Report = require("../models/report")
const router=express.Router()
router.use(checkAuthorization)
router.get("/",async(req,res)=>{
    const userCount = await User.countDocuments();
    const blogCount = await Blog.countDocuments();
    return res.render("adminDashboard",{user:req.user,userCount,blogCount})
})
router.get("/users",async(req,res)=>{
    try {
        const users=await User.find().select("-password -salt");
        return res.render("adminUsers",{users,user:req.user})
    } catch (error) {
        res.render("error",{status:500,error: error.message})
    }
})
router.get("/reported-blogs",async(req,res)=>{
    try {
        const blogs=await Blog.find({noOfReports:{
        $gt:0
    }})
    return res.json({
    success: true,
    message: "Report submitted successfully and is under review."
});
    } catch (error) {
        return res.render("error",{error:error.message,status:500})
    }
    
})
router.get("/blog/:id",async(req,res)=>{
    const {id}=req.params
    try {
        const blog=await Blog.findById(id).populate("createdBy");
        if(!blog){
            return res.render("error",{error:"Blog not found",status:400})
        }
        const reports=await Report.find({blogId:blog._id}).populate("reportedBy")
        return res.render("adminBlog",{user:req.user,blog,reports})
    } catch (error) {
        return res.render("error",{error:error.message,status:500})
    }
})
module.exports=router