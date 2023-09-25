import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    company_address: {
      type: String,
      require: true,
    },
    company_email: {
      type: String,
    },
    company_name: {
      type: String,
      require: true,
    },
    company_phone: {
      type: String,
      require: true,
    },

    gst_number: {
      type: String,
      require: true,
    },

    vechicle_number: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose?.models?.customer || mongoose.model("customer", customerSchema);
