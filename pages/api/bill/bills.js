import { dbConnection } from "@/utilities/connection";
import Bills from "../../../server/models/bills.models";

export default async function billsController(req, res) {
  try {
    dbConnection();
    switch (req.method) {
      case "GET":
        try {
          const result = await Bills.find().sort({ createdAt: -1 });
          return res.status(200).send({ data: result });
        } catch (err) {
          return res.status(500).send({ message: "failed" });
        }
        break;
      case "POST":
        try {
          const bill = new Bills({ ...req.body });
          await bill.save();
          return res.status(200).send({ message: "failed" });
        } catch (err) {
          return res.status(500).send({ message: "failed" });
        }
        break;
      case "PUT":
        try {
          await Bills.findByIdAndUpdate({ _id: req.body.id }, req.body);
          return res.status(200).send({ message: "success" });
        } catch (err) {
          return res.status(500).send({ message: "failed" });
        }
    }
  } catch (err) {
    return res.status(500).send({ message: "failed" });
  }
}
