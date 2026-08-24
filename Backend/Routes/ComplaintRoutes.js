const express=require("express");

const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  verifyOTP,
  resendOTP,
  verifyResolution,
} = require("../Controllers/ComplaintController");

const router=express.Router();
router.post("/",createComplaint);
router.get("/",getComplaints);
router.get("/:id",getComplaintById);
router.put("/:id/status",updateComplaintStatus);
router.delete("/:id",deleteComplaint);
router.post("/:id/verify-otp", verifyOTP);
router.post("/:id/resend-otp", resendOTP);
router.post("/:id/verify-resolution", verifyResolution);
module.exports = router;

