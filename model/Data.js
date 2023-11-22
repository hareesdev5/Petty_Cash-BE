const mongoose = require("./index");

const dataSchema = new mongoose.Schema(
  {
    Amount: { type: Number, required: [true, "Amount is required"] },
    Notes: { type: String, required: [true, "Notes is required"] },
    Total: { type: Number },
    method: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now() },
  },
  {
    collection: "Data",
    versionKey: false,
  }
);

const dataModel = mongoose.model("Data", dataSchema);

module.exports = dataModel;
