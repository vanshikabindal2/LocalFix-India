const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
   
    // BASIC COMPLAINT INFORMATION
  

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

  
    // GPS COORDINATES
  
    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

  
    // SEVERITY

    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
    },

    // IMAGE
   

    image: {
      type: String,
      default: "",
    },

   
    // ANTI-FAKE COMPLAINT
    

    isDuplicate: {
      type: Boolean,
      default: false,
    },

    isSpam: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: [
        "Pending",
        "Verified",
        "Suspicious",
        "Rejected",
      ],
      default: "Pending",
    },

    // OTP VERIFICATION

    otp: {
      type: String,
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },

    // PHOTO INFORMATION

    photoMetadataChecked: {
      type: Boolean,
      default: false,
    },

    // COMPLAINT STATUS

    status: {
      type: String,
      enum: [
        "Reported",
        "Verified",
        "Assigned",
        "Work Started",
        "Resolved",
        "Citizen Verification",
        "Closed",
      ],
      default: "Reported",
    },

    // DEPARTMENT

    department: {
      type: String,
      default: "",
    },

    // PRIORITY

    priority: {
      type: String,
      default: "Normal",
    },

    // CITIZEN RESOLUTION VERIFICATION

    citizenVerified: {
      type: Boolean,
      default: false,
    },

    //problem solve yes or no 
    citizenResolution: {
      type: String,
      enum: ["Yes", "No", null],
      default: null,
    },

    
    // CITIZEN RATING
    

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    // Optional citizen feedback
    citizenFeedback: {
      type: String,
      default: "",
    },
  },

  // TIMESTAMPS
 

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);