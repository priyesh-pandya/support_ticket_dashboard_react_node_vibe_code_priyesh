const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  priority: { type: String, required: true, enum: ["Low", "Medium", "High"] },
  status: { type: String, default: "Open", enum: ["Open", "In Progress", "Resolved"] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
