const express=require("express")
const Blog=require("../models/blog")
const Reports=require("../models/report")
const router=express.Router()
 router.post("/:id",async(req,res)=>{
    if(!req.user){
        return res.render("error",{error:"Not authenticated",status:400});
    }
    try{
        const {content}=req.body
        const {id}=req.params
        const blog=await Blog.findById(id);
        if(!blog){
            return res.render("error",{error:"Blog does not exist",status:400})
        }
        const report=await Reports.create({
            subject:content,
            blogId:id,
            reportedBy:req.user._id
        })
        const blog2=await Blog.findByIdAndUpdate(id,{$inc:{noOfReports:1}})
        return res.redirect(`/blog/${id}`)
    }catch(e){
        return res.render("error",{error:e.message,status:500})
    }

 })

 router.delete("/:id",async(req,res)=>{
    const {id}=req.params
    try{
    const report=await Reports.findByIdAndDelete(id)
    
    if(!report){
        return res.render("error",{error:"Internal Server Error",status:500})
    }
    const blog=await Blog.findByIdAndUpdate(report.blogId,{$inc:{noOfReports:-1}})
    return res.status(200).json({
    success: true,
    blogId: report.blogId
});
    }catch(e){
        return res.render("error",{error:e.message,status:500})
    }
 })

module.exports=router