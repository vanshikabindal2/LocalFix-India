const express=require("express");
const router=express.Router();
const AreaAlert=require("../models/AreaAlert");

router.post("/",async(req,res)=>{
    try{
        const alert = await AreaAlert.create(req.body);
      res.status(201).json({
        success:true,
        message:"area alert created successfully",
        data:alert,
      });

    }catch(error){
        res.status(500).json({
            success:true,
            message:error.message,
        });
    }
});

router.get("/",async(req,res)=>{
    try{
       const alerts=await AreaAlert.find({
        isActive:true,

       }).sort({createdAt:-1});
       res.json({
        success:true,
        data:alerts,
       }) ;
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
})
module.exports=router;