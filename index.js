const express=require('express')
const path=require("path")
const mongoose=require("mongoose")
const cookieParser=require("cookie-parser")
const userRoutes=require("./routes/user")
const blogRoutes=require("./routes/blog")
const Blog=require("./models/blog")
require('dotenv').config();
const { checkForAuthentication } = require('./middlewares/authentication')
const app=express();
const PORT=process.env.PORT||8000;
mongoose.connect(process.env.MONGO_URL).then((e)=>console.log("Mongodb connected"))
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.static(path.resolve("./public")))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthentication("token"))

app.get("/",async(req,res)=>{
    const{category,search}=req.query
    let allBlogs=null;
    if(category===undefined && search===undefined){
        allBlogs=await Blog.find({})
    }else if(search!==undefined){
        allBlogs=await Blog.find({title:{$regex:search, $options:"i"}});
    }else{
        allBlogs=await Blog.find({category:category})
    }

    return res.render("home",{
        user:req.user,
        blogs:allBlogs
    })
})
app.get("/categories",async(req,res)=>{
    return res.render("categories",{
        user:req.user
    })
})

app.use("/user",userRoutes)
app.use("/blog",blogRoutes)
app.listen(PORT,()=>console.log("Server started on Port:",PORT))