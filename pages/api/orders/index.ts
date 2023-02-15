import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { IOrder } from "../../../interfaces/order";
import { db } from "database";
import { Order, Product } from "models";

type Data =
	| {
			message: string;
	  }
	| IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "POST":
			return createOrder(req, res);

		default:
			return res.status(400).json({ message: "Bad Request" });
	}
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { orderItems, total } = req.body as IOrder;

	// verify if is a valid session
	const session: any = await getSession({ req });

	if (!session) {
		return res.status(401).json({ message: "Session is not valid" });
	}

	// Make an array with the product of person want
	const productsIds = orderItems.map(product => product._id);

	db.connect();

	const dbProducts = await Product.find({ _id: { $in: productsIds } });

	try {

		const subTotal = orderItems.reduce((acumulator, currentProduct) => {
			const currentPrice = dbProducts.find(prod => prod.id === currentProduct._id)?.price;

            if (!currentPrice) {
				throw new Error("Verify Cart, product doesn't exists");
			}

			return currentPrice * currentProduct.quantity + acumulator;
		}, 0);
              

		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
		const backendTotal = subTotal * (taxRate + 1);

        
		if (total !== backendTotal) {
			throw new Error("The total is wrong");
		}
        
		// Order is ok
		const userId = session.user._id;

		const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
		newOrder.total = Math.round((newOrder.total * 100) / 100);
		await newOrder.save();   
        db.disconnect();     

		return res.status(201).json(newOrder);

	} catch (error: any) {
		await db.disconnect();
        
		return res.status(400).json({ message: error.message || "Check logs on server" });
	}

};
