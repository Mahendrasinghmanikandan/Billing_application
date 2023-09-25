import { dbConnection } from "@/utilities/connection";
import Admin from "../../../server/models/admin.models";
import { isEmpty } from "lodash";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { encrypt } from "../shared/crypting";

export default async function authAdmin(req, res) {
  try {
    dbConnection();
    // console.log(JSON.parse(req.query.id));
    switch (req.method) {
      case "GET":
        {
          try {
            const { email, password } = JSON.parse(req.query.id);
            const adminData = await Admin.find({ email: email });
            if (isEmpty(adminData)) {
              return res.status(500).send({ message: "Invalid Admin Details" });
            }
            const checkPassword = await bcrypt.compare(
              password,
              adminData[0].password
            );

            if (!checkPassword) {
              return res
                .status(500)
                .send({ message: "Invalid Admin Password" });
            }
            const token = await jwt.sign(
              { id: adminData[0]._id, email: adminData[0].email },
              process.env.Token_KEY,
              { expiresIn: "10h" }
            );

            return res
              .status(200)
              .send({ message: "success", data: encrypt(token) });
          } catch (err) {
            console.log(err);
          }
        }
        break;
    }
  } catch (err) {
    console.log(err);
  }
}
