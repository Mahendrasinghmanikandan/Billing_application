import { dbConnection } from "@/utilities/connection";
import Destination from "../../../server/models/destination.models";
import Products from "../../../server/models/products.models";
import Customers from "../../../server/models/customer.models";
import Vehicle from "../../../server/models/vehicle.models";
import Bills from "../../../server/models/bills.models";

export default async function destinationControllers(req, res) {
  try {
    dbConnection();
    switch (req.method) {
      case "GET":
        try {
          const destinationsCounts = await Destination.count();
          const productsCounts = await Products.count();
          const customersCounts = await Customers.count();
          const vehicleCounts = await Vehicle.count();
          const billCounts = await Bills.count();
          const raw = [
            {
              count: customersCounts,
              name: "Customers",
              redirect: "/customer",
            },
            {
              count: productsCounts,
              name: "Products",
              redirect: "/product",
            },
            {
              count: vehicleCounts,
              name: "Vehicle",
              redirect: "/vehicle-numbers",
            },
            {
              count: destinationsCounts,
              name: "Destinations",
              redirect: "/destination",
            },
            {
              count: billCounts,
              name: "Bills",
              redirect: "/bill",
            },
          ];
          res.status(200).send({ data: raw });
        } catch (err) {
          return res.status(500).send({ message: "failed" });
        }
        break;
    }
  } catch (err) {
    return res.status(500).send({ message: "failed" });
  }
}
