import { dbConnection } from "@/utilities/connection";
import Customer from "../../../server/models/customer.models";

export default async function subCustomerController(req, res) {
  try {
    dbConnection();

    switch (req.method) {
      case "DELETE":
        try {
          await Customer.findByIdAndDelete({ _id: req.query.id });
          return res.status(200).send({ message: "success" });
        } catch (err) {
          console.log(err);
          return res.status(500).send({ message: "failed" });
        }
        break;
    }
  } catch (err) {
    return res.status(200).send({ message: "failed" });
  }
}
