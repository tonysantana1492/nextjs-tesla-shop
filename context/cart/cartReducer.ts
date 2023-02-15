import { CartState } from ".";
import { ICartProduct, ShippingAddress } from "../../interfaces";

type CartActionType =
	| { type: "[Cart] - LoadCart from cookies | storage"; payload: ICartProduct[] }
	| { type: "[Cart] - Update Products in cart"; payload: ICartProduct[] }
	| { type: "[Cart] - Change cart Quantity"; payload: ICartProduct[] }
	| { type: "[Cart] - Remove product in cart"; payload: ICartProduct }
	| { type: "[Cart] - LoadAddress from Cookies"; payload: ShippingAddress }
	| { type: "[Cart] - Update Address"; payload: ShippingAddress }
	| {
			type: "[Cart] - Update order summary";
			payload: {
				numberOfItems: number;
				subTotal: number;
				tax: number;
				total: number;
			};
	  }
	| { type: "[Cart] - Order complete" };

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
	switch (action.type) {
		case "[Cart] - LoadCart from cookies | storage":
			return {
				...state,
				isLoaded: true,
				cart: [...action.payload]
			};

		case "[Cart] - Update Products in cart":
			return {
				...state,
				cart: [...action.payload]
			};

		case "[Cart] - Change cart Quantity":
			return {
				...state,
				cart: [...action.payload]
			};

		case "[Cart] - Update Address":
		case "[Cart] - LoadAddress from Cookies":
			return {
				...state,
				shippingAddress: action.payload
			};

		case "[Cart] - Remove product in cart":
			const productToRemove = action.payload;

			const productUpdates = state.cart.filter(product => {
				if (product._id !== productToRemove._id && product.size !== productToRemove.size) return true;
			});
			return {
				...state,
				cart: productUpdates
			};

		case "[Cart] - Update order summary":
			return {
				...state,
				...action.payload
			};

		case "[Cart] - Order complete":
			return {
				...state,
				cart: [],
				numberOfItems: 0,
				subTotal: 0,
				tax: 0,
				total: 0
			}

		default:
			return state;
	}
};
