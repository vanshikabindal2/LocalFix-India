const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId;  
      },
    },

    googleId: {                  
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["citizen", "admin"],
      default: "citizen",
    },

    trustScore: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);