import { dbConnection } from "@/utilities/connection";
import Vehicle from "../../../server/models/vehicle.models";

export default async function subVehicleController(req, res) {
  try {
    switch (req.method) {
      case "DELETE":
        try {
          console.log("triggered", req.query.id);
          await Vehicle.findByIdAndDelete({ _id: req.query.id });
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
