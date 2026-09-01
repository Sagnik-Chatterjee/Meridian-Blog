const {Schema,model}=require("mongoose")

const reportSchema= new Schema({
    subject:{
        type:String,
        required:true
    },
    blogId:{
        type:Schema.Types.ObjectId,
        ref:'blog'
    },
    reportedBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
},{timestamps:true})

const Report=model('report',reportSchema)

module.exports=Report