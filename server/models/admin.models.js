import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

module.exports =
  mongoose?.models?.admin || mongoose.model("admin", adminSchema);
