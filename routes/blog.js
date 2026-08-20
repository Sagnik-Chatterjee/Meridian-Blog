const express=require("express")
const Blog=require("../models/blog")
const Comment=require("../models/comment")
const multer=require("multer")
const path=require("path")

const router=express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`))
  },
  filename: function (req, file, cb) {
    const fileName=`${Date.now()}-${file.originalname}`
    cb(null,fileName)
  }
})
const upload = multer({ storage: storage })
router.get('/add-new',(req,res)=>{
    return res.render("addBlog",{
        user:req.user
    })
})

router.post("/",upload.single('coverImage'),async(req,res)=>{
    const{title,body,category}=req.body
    const blog=await Blog.create({
        body:body,
        title:title,
        createdBy:req.user._id,
        coverImageURL:`/uploads/${req.file.filename}`,
        category:category
    })
    return res.redirect(`/blog/${blog._id}`)
})

router.get("/:id",async (req,res)=>{
const {id}=req.params
const blog=await Blog.findById(id).populate("createdBy")
const comment=await Comment.find({blogId:id}).populate("createdBy")
return res.render("blog",{
  user:req.user,
  blog:blog,
  comments:comment
})
})

router.post("/comment/:blogId",async (req,res)=>{
  const {content}=req.body
  const {blogId}=req.params
  const comment=await Comment.create({
    content:content,
    blogId:blogId,
    createdBy:req.user._id
  })
  return res.redirect(`/blog/${blogId}`)
})
module.exports=router