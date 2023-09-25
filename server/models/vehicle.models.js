import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicle_number: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose?.models?.vehicle || mongoose.model("vehicle", vehicleSchema);
