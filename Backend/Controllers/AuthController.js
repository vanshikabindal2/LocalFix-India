// const User = require("../models/User");
// const OTP = require("../models/OTP");
// const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");

// // =====================================================
// // NODEMAILER
// // =====================================================

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // =====================================================
// // SEND OTP
// // =====================================================

// const sendOTP = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check fields
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all fields",
//       });
//     }

//     // Password validation
//     if (password.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 6 characters",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({
//       email: email.toLowerCase(),
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "User already exists with this email",
//       });
//     }

//     // Generate 6 digit OTP
//     const otp = Math.floor(
//       100000 + Math.random() * 900000
//     ).toString();

//     // Hash password
//     const hashedPassword = await bcrypt.hash(
//       password,
//       10
//     );

//     // Delete old OTP for same email
//     await OTP.deleteMany({
//       email: email.toLowerCase(),
//     });

//     // Save OTP temporarily
//     await OTP.create({
//       name,
//       email: email.toLowerCase(),
//       password: hashedPassword,
//       otp,
//       expiresAt: new Date(
//         Date.now() + 5 * 60 * 1000
//       ),
//     });

//     // Send OTP email
   

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,

//       subject: "LocalFix India - Email Verification OTP",

//       html: `
//         <div style="
//           font-family: Arial, sans-serif;
//           padding: 20px;
//           max-width: 500px;
//           margin: auto;
//         ">

//           <h2>🇮🇳 LocalFix India</h2>

//           <p>Hello <strong>${name}</strong>,</p>

//           <p>
//             Thank you for registering with LocalFix India.
//           </p>

//           <p>
//             Your email verification OTP is:
//           </p>

//           <h1 style="
//             letter-spacing: 10px;
//             font-size: 32px;
//           ">
//             ${otp}
//           </h1>

//           <p>
//             This OTP is valid for <strong>5 minutes</strong>.
//           </p>

//           <p>
//             Please do not share this OTP with anyone.
//           </p>

//         </div>
//       `,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//     });

//   } catch (error) {
//     console.error("Send OTP Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to send OTP",
//       error: error.message,
//     });
//   }
// };

// // =====================================================
// // VERIFY OTP
// // =====================================================

// const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and OTP are required",
//       });
//     }

//     // Find OTP
//     const otpRecord = await OTP.findOne({
//       email: email.toLowerCase(),
//       otp,
//     });

//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     // Check OTP expiry
//     if (otpRecord.expiresAt < new Date()) {
//       await OTP.deleteOne({
//         _id: otpRecord._id,
//       });

//       return res.status(400).json({
//         success: false,
//         message: "OTP has expired",
//       });
//     }

//     // Double check user doesn't already exist
//     const existingUser = await User.findOne({
//       email: email.toLowerCase(),
//     });

//     if (existingUser) {
//       await OTP.deleteOne({
//         _id: otpRecord._id,
//       });

//       return res.status(409).json({
//         success: false,
//         message: "User already exists with this email",
//       });
//     }

//     // Create actual user
//     const user = await User.create({
//       name: otpRecord.name,
//       email: otpRecord.email,
//       password: otpRecord.password,
//       role: "citizen",
//       trustScore: 100,
//     });

//     // Delete used OTP
//     await OTP.deleteOne({
//       _id: otpRecord._id,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Email verified and registration successful",

//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         trustScore: user.trustScore,
//       },
//     });

//   } catch (error) {
//     console.error("Verify OTP Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =====================================================
// // LOGIN
// // =====================================================

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter email and password",
//       });
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase(),
//     });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       user.password
//     );

//     if (!isPasswordCorrect) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",

//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         trustScore: user.trustScore,
//       },
//     });

//   } catch (error) {
//     console.error("Login Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =====================================================
// // REGISTER - OPTIONAL OLD ROUTE
// // =====================================================

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all fields",
//       });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 6 characters",
//       });
//     }

//     const existingUser = await User.findOne({
//       email: email.toLowerCase(),
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "User already exists with this email",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(
//       password,
//       10
//     );

//     const user = await User.create({
//       name,
//       email: email.toLowerCase(),
//       password: hashedPassword,
//       role: "citizen",
//       trustScore: 100,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Registration successful",

//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         trustScore: user.trustScore,
//       },
//     });

//   } catch (error) {
//     console.error("Register Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // =====================================================
// // EXPORTS
// // =====================================================

// module.exports = {
//   registerUser,
//   loginUser,
//   sendOTP,
//   verifyOTP,
// };

const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// =====================================================
// NODEMAILER
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================================================
// SEND OTP
// =====================================================

const sendOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("=================================");
    console.log("SEND OTP REQUEST");
    console.log("Name:", name);
    console.log("OTP will be sent to:", email);
    console.log("=================================");

    // Check fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Clean email
    const cleanEmail = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    console.log("Generated OTP:", otp);
    console.log("Sending OTP to:", cleanEmail);

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Delete old OTP
    await OTP.deleteMany({
      email: cleanEmail,
    });

    // Save OTP
    await OTP.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      otp,
      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ),
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: cleanEmail,

      subject: "LocalFix India - Email Verification OTP",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 500px;
          margin: auto;
          border: 1px solid #ddd;
          border-radius: 10px;
        ">

          <h2>🇮🇳 LocalFix India</h2>

          <p>Hello <strong>${name}</strong>,</p>

          <p>
            Thank you for registering with LocalFix India.
          </p>

          <p>
            Your email verification OTP is:
          </p>

          <h1 style="
            letter-spacing: 10px;
            font-size: 32px;
          ">
            ${otp}
          </h1>

          <p>
            This OTP is valid for
            <strong>5 minutes</strong>.
          </p>

          <p>
            Please do not share this OTP with anyone.
          </p>

          <hr />

          <p style="font-size: 12px; color: #777;">
            This is an automated email from LocalFix India.
          </p>

        </div>
      `,
    });

    console.log(
      "OTP email sent successfully to:",
      cleanEmail
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Send OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// =====================================================
// VERIFY OTP
// =====================================================

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    console.log("=================================");
    console.log("VERIFY OTP");
    console.log("Email:", cleanEmail);
    console.log("OTP:", otp);
    console.log("=================================");

    // Find OTP
    const otpRecord = await OTP.findOne({
      email: cleanEmail,
      otp: otp.toString().trim(),
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check expiry
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Check existing user again
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user
    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
      role: "citizen",
      trustScore: 100,
    });

    // Delete OTP after successful verification
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    console.log(
      "User registered successfully:",
      user.email
    );

    return res.status(201).json({
      success: true,
      message:
        "Email verified and registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        trustScore: user.trustScore,
      },
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        trustScore: user.trustScore,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// OLD REGISTER ROUTE
// =====================================================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: "citizen",
      trustScore: 100,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        trustScore: user.trustScore,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  registerUser,
  loginUser,
  sendOTP,
  verifyOTP,
};