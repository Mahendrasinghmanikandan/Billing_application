import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    return await mongoose.connect(process.env.Atlas_URL);
  } catch (err) {
    return err;
  }
};
