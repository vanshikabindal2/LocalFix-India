const generateOTP = require("../utils/otpGenerator");

const Complaint = require("../models/complaint");

// =====================================================
// CREATE COMPLAINT
// =====================================================

const createComplaint = async (req, res) => {
  try {
    const {
      category,
      description,
      location,
      latitude,
      longitude,
      severity,
      image,
      department,
    } = req.body;

    // 1. BASIC VALIDATION

    if (!category || !description || !location || !severity) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // 2. SPAM DETECTION

    if (description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please provide a proper complaint description.",
        isSpam: true,
      });
    }

    // 3. PHOTO CHECK

    if (image) {
      const isValidImage = image.startsWith("data:image/");

      if (!isValidImage) {
        return res.status(400).json({
          success: false,
          message: "Invalid image file.",
        });
      }

      const imageSizeInMB =
        (image.length * 3) / 4 / (1024 * 1024);

      if (imageSizeInMB > 5) {
        return res.status(400).json({
          success: false,
          message: "Image size should be less than 5MB.",
        });
      }
    }

    // 4. DUPLICATE DETECTION

    const duplicateComplaint = await Complaint.findOne({
      category: category,
      location: location,
      status: {
        $ne: "Closed",
      },
    });

    if (duplicateComplaint) {
      return res.status(409).json({
        success: false,
        message:
          "A similar complaint already exists at this location.",
        isDuplicate: true,
        complaint: duplicateComplaint,
      });
    }

    // 5. CREATE COMPLAINT

    const otp = generateOTP();

    const newComplaint = await Complaint.create({
      category,
      description,
      location,

      // GPS
      latitude,
      longitude,

      severity,
      image,
      department,

      // Anti-Fake Complaint
      isDuplicate: false,
      isSpam: false,
      verificationStatus: "Pending",

      // OTP Verification
      otp: otp,
      otpExpiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ),
      otpVerified: false,

      // Basic photo check
      photoMetadataChecked: image ? true : false,

      // Citizen Resolution
      citizenVerified: false,
      citizenResolution: null,
      rating: null,
      citizenFeedback: "",
    });

    // 6. SUCCESS RESPONSE

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    console.error("Create Complaint Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL COMPLAINTS
// =====================================================

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Get Complaints Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET SINGLE COMPLAINT
// =====================================================

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Get Complaint Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE COMPLAINT STATUS / DEPARTMENT
// =====================================================

const updateComplaintStatus = async (req, res) => {
  try {
    const { status, department } = req.body;

    const updateData = {};

    if (status) {
      updateData.status = status;
    }

    if (department !== undefined) {
      updateData.department = department;
    }

    const updatedComplaint =
      await Complaint.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error(
      "Update Complaint Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// VERIFY OTP
// =====================================================

const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { id } = req.params;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Please enter OTP",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (complaint.otpVerified) {
      return res.status(400).json({
        success: false,
        message: "Complaint is already verified",
      });
    }

    if (
      !complaint.otpExpiresAt ||
      new Date() > complaint.otpExpiresAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    if (complaint.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    complaint.otpVerified = true;
    complaint.verificationStatus = "Verified";

    complaint.otp = null;
    complaint.otpExpiresAt = null;

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      complaint,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// RESEND OTP
// =====================================================

const resendOTP = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (complaint.otpVerified) {
      return res.status(400).json({
        success: false,
        message: "Complaint is already verified",
      });
    }

    const newOTP = generateOTP();

    complaint.otp = newOTP;

    complaint.otpExpiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    complaint.verificationStatus = "Pending";
    complaint.otpVerified = false;

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "New OTP generated successfully",
      otp: newOTP,
      otpExpiresAt: complaint.otpExpiresAt,
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// CITIZEN RESOLUTION VERIFICATION + RATING
// =====================================================

const verifyResolution = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      citizenResolution,
      rating,
      citizenFeedback,
    } = req.body;

    // Check YES / NO
    if (!citizenResolution) {
      return res.status(400).json({
        success: false,
        message: "Please select Yes or No",
      });
    }

    // Only YES or NO allowed
    if (
      citizenResolution !== "Yes" &&
      citizenResolution !== "No"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Citizen resolution must be Yes or No",
      });
    }

    // Find complaint
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Only Resolved complaint can be verified
    if (complaint.status !== "Resolved") {
      return res.status(400).json({
        success: false,
        message:
          "Only resolved complaints can be verified.",
      });
    }

    // =================================================
    // YES → RATING → CLOSED
    // =================================================

    if (citizenResolution === "Yes") {
      if (
        rating === undefined ||
        rating === null ||
        rating === ""
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a rating",
        });
      }

      const numericRating = Number(rating);

      if (
        Number.isNaN(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rating must be between 1 and 5",
        });
      }

      complaint.citizenResolution = "Yes";
      complaint.citizenVerified = true;
      complaint.rating = numericRating;
      complaint.citizenFeedback =
        citizenFeedback || "";

      // Problem successfully solved
      complaint.status = "Closed";
    }

    // =================================================
    // NO → REOPEN COMPLAINT
    // =================================================

    if (citizenResolution === "No") {
      complaint.citizenResolution = "No";
      complaint.citizenVerified = true;
      complaint.rating = null;
      complaint.citizenFeedback =
        citizenFeedback || "";

      // Complaint goes back for further work
      complaint.status = "Work Started";
    }

    await complaint.save();

    res.status(200).json({
      success: true,

      message:
        citizenResolution === "Yes"
          ? "Complaint verified and closed successfully"
          : "Complaint reopened for further work",

      complaint,
    });
  } catch (error) {
    console.error(
      "Verify Resolution Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE COMPLAINT
// =====================================================

const deleteComplaint = async (req, res) => {
  try {
    const complaint =
      await Complaint.findByIdAndDelete(
        req.params.id
      );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
      complaint,
    });
  } catch (error) {
    console.error(
      "Delete Complaint Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  verifyOTP,
  resendOTP,
  verifyResolution,
};