import { dbConnection } from "@/utilities/connection";
import Product from "../../../server/models/products.models";

export default async function productController(req, res) {
  try {
    dbConnection();
    switch (req.method) {
      case "GET":
        try {
          const productData = await Product.find().sort({ createdAt: -1 });
          return res.status(200).send({ data: productData });
        } catch (err) {
          return res.status(500).send({ message: "failed" });
        }
        break;
      case "POST":
        try {
          const product = new Product({ ...req.body });
          await product.save();
          return res.status(200).send({ message: "success" });
        } catch (err) {
          return res.status(500).send({ message: "failed" });
        }
        break;
      case "PUT":
        try {
          console.log(req.body);
          await Product.findByIdAndUpdate({ _id: req.body.id }, req.body.value);
          return res.status(200).send({ message: "success" });
        } catch (err) {
          return res.status(500).send({ message: "failed" });
        }
        break;
    }
  } catch (err) {
    return res.status(500).send({ message: "failed" });
  }
}
