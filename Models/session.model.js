const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // Reference to User schema
    required: true
  },
  sessionStart: {
    type: Date,
    required: true
  },
  sessionEnd: {
    type: Date,
    required: true
  },
  focusLevel: {
    type: [Number],  // Array of numbers (ex: focus level per minute)
    default: []
  },
  feedback: {
    type: String
  },
  rawData: {
    type: Object // or [Object] depending on ML team needs
  }
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);