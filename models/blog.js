const {Schema,model}=require("mongoose")

const blogSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:["Sports","Food","Education","Gaming","Travel","Entertainment","Technology"]
    },
    body:{
        type:String,
        required:true
    },
    coverImageURL:{
        type:String
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    noOfReports:{
        type:Number,
        default:0
    }
},{timestamps:true})

const Blog=model('blog',blogSchema)

module.exports=Blog