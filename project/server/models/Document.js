import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    summary: {
      type: String,
      required: false,
    },
    analysis: {
      type: [Object],
      required: false,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
