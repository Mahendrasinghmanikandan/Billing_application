import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      require: true,
    },
    quantity: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose?.models?.product || mongoose.model("product", productSchema);
