import { FC, useEffect, useReducer, useRef } from "react";
import Cookies from "js-cookie";

import { CartContext, cartReducer } from "./";
import { ICartProduct, IOrder, IProduct, ShippingAddress } from "../../interfaces";
import { tesloApi } from "api";
import axios from "axios";

interface ProviderProps {
	children: React.ReactNode;
}

export interface CartState {
	isLoaded: boolean;
	cart: ICartProduct[];
	numberOfItems: number;
	subTotal: number;
	tax: number;
	total: number;
	shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
	isLoaded: false,
	cart: [],
	numberOfItems: 0,
	subTotal: 0,
	tax: 0,
	total: 0,
	shippingAddress: undefined
};

export const CartProvider: FC<ProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

	useEffect(() => {
		try {
			const cookieProducts = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")!) : [];
			dispatch({ type: "[Cart] - LoadCart from cookies | storage", payload: cookieProducts });
		} catch (error) {
			dispatch({ type: "[Cart] - LoadCart from cookies | storage", payload: [] });
		}
	}, []);

	// When reload de page if I have  Cookies address information, I set its in the Cart Context
	useEffect(() => {
		if (Cookies.get("firstName")) {
			const shippingAddress = {
				firstName: Cookies.get("firstName") || "",
				lastName: Cookies.get("lastName") || "",
				address: Cookies.get("address") || "",
				address2: Cookies.get("address2") || "",
				zip: Cookies.get("zip") || "",
				city: Cookies.get("city") || "",
				country: Cookies.get("country") || "",
				phone: Cookies.get("phone") || ""
			};

			dispatch({ type: "[Cart] - LoadAddress from Cookies", payload: shippingAddress });
		}
	}, []);

	// When the state.cart change the new value is set in Cookies
	useEffect(() => {
		Cookies.set("cart", JSON.stringify(state.cart));
	}, [state.cart]);

	useEffect(() => {
		const numberOfItems = state.cart.reduce(
			(acumulator, currentProduct) => acumulator + currentProduct.quantity,
			0
		);

		const subTotal = state.cart.reduce(
			(acumulator, currentProduct) => acumulator + currentProduct.price * currentProduct.quantity,
			0
		);

		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

		const orderSummary = {
			numberOfItems,
			subTotal,
			tax: subTotal * taxRate,
			total: subTotal * (taxRate + 1)
		};

		dispatch({ type: "[Cart] - Update order summary", payload: orderSummary });
	}, [state.cart]);

	// Methods
	const addProductToCart = (product: ICartProduct) => {
		const { _id, size, quantity } = product;

		const productInCart = state.cart.some(item => item._id === _id);

		if (!productInCart) {
			dispatch({ type: "[Cart] - Update Products in cart", payload: [...state.cart, product] });
			return;
		}

		const productInCartButDifferentSize = state.cart.some(item => item._id === _id && item.size === size);

		if (!productInCartButDifferentSize) {
			dispatch({ type: "[Cart] - Update Products in cart", payload: [...state.cart, product] });
			return;
		}

		const updatedProducts: ICartProduct[] = state.cart.map(item => {
			if (item._id !== _id) return item;
			if (item.size !== size) return item;
			return product;
		});

		dispatch({ type: "[Cart] - Update Products in cart", payload: updatedProducts });
	};

	const updateCartQuantity = (product: ICartProduct) => {
		const updatedProducts: ICartProduct[] = state.cart.map(productState => {
			if (productState._id !== product._id) return productState;
			if (productState.size !== product.size) return productState;

			return product;
		});

		dispatch({ type: "[Cart] - Change cart Quantity", payload: updatedProducts });
	};

	const removeCartProduct = (product: ICartProduct) => {
		dispatch({ type: "[Cart] - Remove product in cart", payload: product });
	};

	const updateAddress = (address: ShippingAddress) => {
		Cookies.set("firstName", address.firstName);
		Cookies.set("lastName", address.lastName);
		Cookies.set("address", address.address);
		Cookies.set("address2", address.address2 || "");
		Cookies.set("zip", address.zip);
		Cookies.set("city", address.city);
		Cookies.set("country", address.country);
		Cookies.set("phone", address.phone);

		dispatch({ type: "[Cart] - Update Address", payload: address });
	};

	// Orders
	const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {
		if (!state.shippingAddress) {
			throw new Error("Delivered's address doesn't exists");
		}

		const body: IOrder = {
			orderItems: state.cart.map(p => ({
				...p,
				size: p.size!
			})),
			shippingAddress: state.shippingAddress,
			numberOfItems: state.numberOfItems,
			subTotal: state.subTotal,
			tax: state.tax,
			total: state.total,
			isPaid: false
		};

		try {
			const { data } = await tesloApi.post<IOrder>("/orders", body);

			// Dispatch clean cart
			dispatch({ type: "[Cart] - Order complete" });

			return {
				hasError: false,
				message: data._id!
			};
			
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					hasError: true,
					message: error.response?.data.message
				};
			}

			return {
				hasError: true,
				message: "Error not controller. Call the Admin"
			};
		}
	};

	return (
		<CartContext.Provider
			value={{
				...state,

				// Methods
				addProductToCart,
				updateCartQuantity,
				removeCartProduct,
				updateAddress,

				// Orders
				createOrder
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
