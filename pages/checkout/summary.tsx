import { useContext, useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { Box, Button, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";

import { CartContext } from "../../context/cart/CartContext";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";

const SummaryPage: NextPage = () => {
	
	const router = useRouter();

	// Contexts
	const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);

	// States
	const [isPosting, setIsPosting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	// Redirecto to /checkout/address if there are no information in the Cookies
	useEffect(() => {
		if (!Cookies.get("firstName")) {
			router.replace("/checkout/address");
		}
	}, [router]);


	// Create a Order
	const onCreateOrder = async () => {
		setIsPosting(true);

		const { hasError, message } = await createOrder();

		if (hasError) {
			setIsPosting(false);
			setErrorMessage(message);
			return;
		}

		router.replace(`/orders/${message}`);
	};

	// If there are not shippingAddress return null;
	if (!shippingAddress) {
		return <></>;
	}

	// Data
	const { firstName, lastName, address, address2 = "", zip, city, country, phone } = shippingAddress;

	return (
		<ShopLayout title='Order Summary' pageDescription='Summary of the Order'>
			<Typography variant='h1' component='h1'>
				Order Summary
			</Typography>

			<Grid container sx={{ mt: 3 }}>
				<Grid item xs={12} sm={7}>
					<CartList />
				</Grid>

				<Grid item xs={12} sm={5}>
					<Card className='summary-card'>
						<CardContent>
							<Typography variant='h2'>
								Summary ({numberOfItems} {numberOfItems > 1 ? "products" : "product"} )
							</Typography>

							<Divider sx={{ my: 1 }} />

							<Box display='flex' justifyContent='space-between'>
								<Typography variant='subtitle1'>Delivery address</Typography>
								<Link href='/checkout/address'>
									<Typography
										variant='subtitle1'
										color='secondary'
										sx={{ textDecoration: "underline" }}
									>
										Edit
									</Typography>
								</Link>
							</Box>

							<Typography>
								{firstName} {lastName}
							</Typography>
							<Typography>
								{address} {address2 ? `, ${address2}` : ""}
							</Typography>
							<Typography>
								{city}, {zip}
							</Typography>
							<Typography>{country}</Typography>
							<Typography>{phone}</Typography>

							<Divider sx={{ my: 1 }} />

							<Box display='flex' justifyContent='end'>
								<Link href='/cart'>
									{/* <EditOutlined /> */}
									<Typography
										variant='subtitle1'
										color='secondary'
										sx={{ textDecoration: "underline" }}
									>
										Edit
									</Typography>
								</Link>
							</Box>

							<OrderSummary />

							<Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
								<Button
									color='secondary'
									className='circular-btn'
									fullWidth
									disabled={isPosting}
									onClick={onCreateOrder}
								>
									Confirm Order
								</Button>
								<Chip
									color='error'
									label={errorMessage}
									sx={{ display: errorMessage ? "flex" : "none", mt: 2 }}
								/>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default SummaryPage;
