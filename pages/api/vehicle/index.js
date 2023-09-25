import { dbConnection } from "@/utilities/connection";
import Vehicle from "../../../server/models/vehicle.models";
import { isEmpty } from "lodash";

export default async function vehicleController(req, res) {
  try {
    dbConnection();
    switch (req.method) {
      case "GET":
        try {
          const result = await Vehicle.find().sort({ createdAt: -1 });
          return res.status(200).send({ data: result });
        } catch (err) {
          console.log(err);
          return res.status(500).send({ message: "failed" });
        }
        break;
      case "POST":
        try {
          const validate = await Vehicle.find({ vehicle_number: req.body.vehicle_number });
          if (!isEmpty(validate)) {
            return res.status(200).send({ message: "already exited" });
          }
          const vechile = new Vehicle({ ...req.body });
          await vechile.save();
          return res.status(200).send({ message: "success" });
        } catch (err) {
          console.log(err);
          return res.status(500).send({ message: "failed" });
        }
        break;
      case "PUT":
        try {
          const validate = await Vehicle.find({ vehicle_number: req.body.value.vehicle_number });
          if (!isEmpty(validate)) {
            return res.status(200).send({ message: "already exited" });
          }
          await Vehicle.findByIdAndUpdate({ _id: req.body.id }, req.body.value);
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
