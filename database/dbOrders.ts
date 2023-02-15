import { db } from "database";
import { IOrder } from "interfaces";
import { Order } from "models";
import { isValidObjectId } from "mongoose";


export const getOrderById = async (id: string): Promise<IOrder | null> => {

	if(!isValidObjectId(id)) return null;
	
	db.connect();
	const order = await Order.findById(id).lean();
	db.disconnect();

	if(!order) return null;

	return JSON.parse(JSON.stringify(order));
};

export const getOrdersByUser = async (userId: string): Promise<IOrder[]>=> {

	if(!isValidObjectId(userId)){
		return [];
	}

	await db.connect();
	const orders = await Order.find({user: userId}).lean();
	await db.disconnect();

	return JSON.parse(JSON.stringify(orders));

}
