import Document from "../models/Document.js";
import fs from "fs";
import generateResponse from "./geminiService.js";

// Upload a new document
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const filePath = req.file.path;
    const title = req.file.originalname;

    const fileContent = fs.readFileSync(filePath).toString("base64");
    const response = await generateResponse(fileContent);

    try {
      const json_response = JSON.parse(response.text);
      const summary = json_response["summary"] || "No summary available";
      const analysis = json_response["analysis"] || "No analysis available";
      const uploadedBy = req.user._id;
      const document = new Document({
        title,
        summary,
        analysis,
        uploadedBy,
      });
      await document.save();
      res.status(201).json(document);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      return res
        .status(500)
        .json({ error: "Failed to parse response from Gemini" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single document by ID
export const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ error: "Document not found" });
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }
    res.json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all documents uploaded by the current user
export const getAllUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user._id });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
