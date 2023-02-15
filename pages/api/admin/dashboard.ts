import { db } from "database";
import { Order, Product, User } from "models";
import { NextApiRequest, NextApiResponse } from "next";

type Data =
	| {
			numberOfOrders: number;
			paidOrders: number;
			notpaidOrders: number;
			numberOfClients: number;
			numberOfProducts: number;
			productsWithNoInventory: number;
			lowInventory: number;
	  }
	| {
			message: string;
	  };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	await db.connect();

	const [
		numberOfOrders,
		paidOrders,
		notpaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory
	] = await Promise.all([
		Order.count(),
		Order.find({ isPaid: true }).count(),
		Order.find({ isPaid: false }).count(),
		User.find({ role: "client" }).count(),
		Product.count(),
		Product.find({ inStock: 0 }).count(),
		Product.find({ inStock: { $lte: 10 } }).count()
	]);

	await db.disconnect();

	switch (req.method) {
		case "GET":
			return res.status(200).json({
				numberOfOrders,
				paidOrders,
				notpaidOrders,
				numberOfClients,
				numberOfProducts,
				productsWithNoInventory,
				lowInventory
			});

		default:
			return res.status(400).json({ message: "Bad request" });
	}
}
