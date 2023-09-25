import { dbConnection } from "@/utilities/connection";
import Destination from "../../../server/models/destination.models";
import { isEmpty } from "lodash";

export default async function destinationControllers(req, res) {
  try {
    dbConnection();
    switch (req.method) {
      case "GET":
        try {
          const destinations = await Destination.find().sort({ createdAt: -1 })
          res.status(200).send({ data: destinations })
        } catch (err) {
          return res.status(500).send({ message: "failed" })
        }
        break;
      case "POST":
        try {
          const validate = await Destination.find({ destinations: req.body.destinations });
          if (!isEmpty(validate)) {
            return res.status(200).send({ message: "already exited" });
          }
          const destination = new Destination({ ...req.body });
          await destination.save();
          res.status(200).send({ message: "success" })
        } catch (err) {
          console.log(err);
          return res.status(500).send({ message: "failed" })
        }
        break;
      case "PUT":
        try {
          const validate = await Destination.find({ destinations: req.body.value.destinations });
          if (!isEmpty(validate)) {
            return res.status(200).send({ message: "already exited" });
          }
          await Destination.findByIdAndUpdate({ _id: req.body.id }, req.body.value)
          res.status(200).send({ message: "success" })
        } catch (err) {
          console.log(err);
          return res.status(500).send({ message: "failed" })
        }
        break;
    }
  } catch (err) {
    return res.status(500).send({ message: "failed" });
  }
}
