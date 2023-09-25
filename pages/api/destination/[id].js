import { dbConnection } from "@/utilities/connection";
import Destination from "../../../server/models/destination.models";

export default async function subDestinationController(req, res) {
    try {
        dbConnection();
        switch (req.method) {
            case "DELETE":
                try {
                    await Destination.findByIdAndDelete({ _id: req.query.id });
                    return res.status(200).send({ message: "success" })
                } catch (err) {
                    return res.status(500).send({ message: "failed" })
                }
        }
    } catch (err) {
        return res.status(500).send({ message: "failed" });
    }
}