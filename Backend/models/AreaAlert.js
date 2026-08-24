const mongoose=require("mongoose");
const areaAlertSchema=new mongoose.Schema(
    {
    area:{
        type:String,
        required:true,
        trim:true,
    },
    
    problem:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    severity:{
        type:String,
        enum:["High","Critical"],
        default:'High',
    },
    latitude:{
        type:Number,
        required:true,
    },
    longitude:{
       
        type:Number,
        required:true,
    },

    isActive:{
        type:Boolean,
        default:true,
    },
    expireAt:{
        type:Date,
    },

    

},
{
    timestamps:true,
}
)
module.exports=mongoose.model("AreaAlert",areaAlertSchema);