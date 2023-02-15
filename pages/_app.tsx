import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../styles/globals.css";
import "../styles/toolbarStyle.css";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { SWRConfig } from "swr";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { lightTheme } from "../themes/light-theme";
import { UiProvider, CartProvider, AuthProvider } from "../context";

interface Props extends AppProps {
	theme: string;
}

const App = ({ Component, pageProps: { session, ...pageProps } }: Props) => {
	return (
		<SessionProvider session={session}>
			<PayPalScriptProvider options={{"client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}}>
				<SWRConfig
					value={{
						refreshInterval: 3000,
						fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
					}}
				>
					<AuthProvider>
						<CartProvider>
							<UiProvider>
								<ThemeProvider theme={lightTheme}>
									<CssBaseline />
									<Component {...pageProps} />
								</ThemeProvider>
							</UiProvider>
						</CartProvider>
					</AuthProvider>
				</SWRConfig>
			</PayPalScriptProvider>
		</SessionProvider>
	);
};

export default App;
