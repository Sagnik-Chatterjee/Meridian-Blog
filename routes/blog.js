const express=require("express")
const Blog=require("../models/blog")
const Comment=require("../models/comment")
const Report=require("../models/report")
const multer=require("multer")
const path=require("path")
const {uploadOnCloudinary,deleteCloudinary}=require("../middlewares/cloudinary")
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
    const img=await uploadOnCloudinary(`${req.file.path}`)
    if(!img){
      return res.status(400).json({error:"Cannot upload"})
    }
    const blog=await Blog.create({
        body:body,
        title:title,
        createdBy:req.user._id,
        coverImageURL:img.url,
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

router.get("/user/myblogs/:id",async(req,res)=>{
  const {id}=req.params;
  const blogs=await Blog.find({createdBy:id});
    return res.render("myblogs",{user:req.user,blogs:blogs})
})
router.get("/editTitle/:id",async(req,res)=>{
  const{id}=req.params
  const blog=await Blog.findById(id)
  if(String(req.user._id)!==String(blog.createdBy)){
    return res.render("error",{error:"Not authorized",status:400})
  }
  return res.render("editTitle",{user:req.user,id:id})
})
router.post("/editTitle/:id",async(req,res)=>{
  const {id}=req.params;
  const {title}=req.body
  if(title==="" || title.trim()===""){
    return res.render("editTitle",{error:"Empty Title",user:req.user,id:id})
  }
  const blog=await Blog.findByIdAndUpdate(id,{title:title})
  return res.redirect("/")
})
router.get("/edit/:id",async(req,res)=>{
  const{id}=req.params
  const blog=await Blog.findById(id)
  if(String(req.user._id)!==String(blog.createdBy)){
    return res.render("error",{error:"Not authorized",status:400})
  }
  return res.render("editBlog",{user:req.user,id:id,blog})
})
router.post("/editBlog/:id",async(req,res)=>{
  const {id}=req.params;
  const {body}=req.body
  if(body==="" || body.trim()===""){
    return res.render("editBlog",{error:"Empty Blog",user:req.user,id:id,blog:body})
  }
  const blog=await Blog.findByIdAndUpdate(id,{body:body})
  return res.redirect("/")
})
router.delete("/delete/:id",async(req,res)=>{
  const{id}=req.params
  await Comment.deleteMany({ blogId:id });
  await Report.deleteMany({blogId:id})
  const blog=await Blog.findByIdAndDelete(id);
  const del=await deleteCloudinary(blog.coverImageURL);
  if(!del){
    return res.status(400).json({error:"Cannot delete"})
  }
  return res.status(200).json({blog})
})
module.exports=router