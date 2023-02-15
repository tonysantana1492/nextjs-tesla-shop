import { FC, useReducer, useEffect } from "react";

import { useRouter } from "next/router";

import Cookies from "js-cookie";
import axios from "axios";

import { AuthContext } from "./";
import tesloApi from "../../api/tesloApi";
import { authReducer } from "./";
import { IUser } from "../../interfaces";
import { useSession, signOut } from "next-auth/react";

interface Props {
	children: React.ReactNode;
}

export interface AuthState {
	isLoggedIn: boolean;
	user?: IUser;
}

const INITIAL_DATA: AuthState = {
	isLoggedIn: false,
	user: undefined
};

export const AuthProvider: FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, INITIAL_DATA);
	const { data, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === 'authenticated') {
			
			dispatch({type: '[Auth] - Login', payload: data?.user as IUser});
		}
	}, [data, status]);

	// const checkToken = useCallback(async () => {
	// 	if (!Cookies.get("token")) return;

	// 	try {
	// 		const { data } = await tesloApi.get("/auth/validate-token");
	// 		const { token, user } = data;

	// 		Cookies.set("token", token);
	// 		dispatch({ type: "[Auth] - Login", payload: user });
	// 	} catch (error) {
	// 		Cookies.remove("token");
	// 	}
	// }, []);

	// useEffect(() => {
	// 	checkToken();
	// }, [checkToken]);

	const loginUser = async (email: string, password: string): Promise<boolean> => {
		try {
			const { data } = await tesloApi.post("/user/login", { email, password });
			const { token, user } = data;

			Cookies.set("token", token);
			dispatch({ type: "[Auth] - Login", payload: user });
			return true;
		} catch (error) {
			return false;
		}
	};

	const logoutUser = async () => {

		Cookies.remove("cart");

		Cookies.remove("firstName");
		Cookies.remove("lastName");
		Cookies.remove("address");
		Cookies.remove("address2");
		Cookies.remove("zip");
		Cookies.remove("city");
		Cookies.remove("country");
		Cookies.remove("phone");

		signOut();
	};

	const registerUser = async (
		email: string,
		name: string,
		password: string
	): Promise<{ hasError: boolean; message?: string }> => {
		try {
			const { data } = await tesloApi.post("/user/register", { name, email, password });
			const { token, user } = data;

			Cookies.set("token", token);
			dispatch({ type: "[Auth] - Login", payload: user });
			return {
				hasError: false
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
				message: "User couldn't be created. Please try again"
			};
		}
	};

	return (
		<AuthContext.Provider value={{ ...state, loginUser, logoutUser, registerUser }}>
			{children}
		</AuthContext.Provider>
	);
};
