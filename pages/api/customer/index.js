import { dbConnection } from "@/utilities/connection";
import Customer from "../../../server/models/customer.models";

export default async function customerController(req, res) {
  try {
    dbConnection();
    switch (req.method) {
      case "GET":
        try {
          const customers = await Customer.find().sort({ createdAt: -1 });
          return res.status(200).send({ data: customers });
        } catch (err) {
          console.log(err);
          return res.status(500).send({ message: "failed" });
        }
        break;
      case "POST":
        try {
          const customer = new Customer({ ...req.body });
          await customer.save();
          return res.status(200).send({ message: "success" });
        } catch (err) {
          console.log(err);
          return res.status(500).send({ message: "failed" });
        }
        break;
      case "PUT":
        try {
          await Customer.findByIdAndUpdate(
            { _id: req.body.id },
            req.body.value
          );
          return res.status(200).send({ message: "success" });
        } catch (err) {
          console.log(err);
          return res.status(500).send({ message: "failed" });
        }
        break;
    }
  } catch (err) {
    return res.status(500).send({ message: "failed" });
  }
}
