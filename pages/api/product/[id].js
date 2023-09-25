import { dbConnection } from "@/utilities/connection";
import Product from "../../../server/models/products.models";

export default async function subProductController(req, res) {
  try {
    dbConnection();
    switch (req.method) {
      case "DELETE":
        try {
          await Product.findByIdAndDelete({ _id: req.query.id });
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
