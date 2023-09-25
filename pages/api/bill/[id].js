import { dbConnection } from "@/utilities/connection";
import Bills from "../../../server/models/bills.models";

export default async function subBillsController(req, res) {
  try {
    dbConnection();
    switch (req.method) {
      case "GET":
        console.log("triger", req.query);

        try {
          const result = await Bills.find({ _id: req.query.id });
          return res.status(200).send({ data: result });
        } catch (err) {
          return res.status(500).send({ message: "failed" });
        }
        break;
      case "DELETE":
        try {
          await Bills.findByIdAndDelete({ _id: req.query.id });
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
