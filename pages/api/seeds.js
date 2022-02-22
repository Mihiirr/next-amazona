import nc from "next-connect";
import Product from "../../models/Product";
import User from "../../models/User";
import data from "../../utils/data";
import db from "../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  User.deleteMany();
  User.insertMany(data.users);
  Product.deleteMany();
  Product.insertMany(data.products);
  await db.disconnect();
  res.send("message succeed");
});

export default handler;
