import { dbConnection } from "@/utilities/connection";
import Destination from "../../../server/models/destination.models";
import Products from "../../../server/models/products.models";
import Customers from "../../../server/models/customer.models";
import Vehicle from "../../../server/models/vehicle.models";
import Bills from "../../../server/models/bills.models";

export default async function billControllers(req, res) {
    try {
        dbConnection();
        switch (req.method) {
            case "GET":
                try {
                    const destinationsCounts = await Destination.find();
                    const productsCounts = await Products.find();
                    const customersCounts = await Customers.find();
                    const vehicleCounts = await Vehicle.find();
                    const billCounts = await Bills.find().count();
                    const raw = [
                        { customers: customersCounts },
                        { products: productsCounts },
                        { vehicle: vehicleCounts },
                        { destinations: destinationsCounts },
                        { bills: billCounts },
                    ]
                    res.status(200).send({ data: raw })
                } catch (err) {
                    return res.status(500).send({ message: "failed" })
                }
                break;
        }
    } catch (err) {
        return res.status(500).send({ message: "failed" });
    }
}
