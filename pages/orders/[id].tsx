import { useState } from "react";
import { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { PayPalButtons } from "@paypal/react-paypal-js";

import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { dbOrder } from "database";
import { IOrder } from "../../interfaces";
import { tesloApi } from "api";

type OrderResponseBody = {
	id: string;
	status: "COMPLETED" | "SAVED" | "APPROVED" | "VOIDED" | "PAYER_ACTION_REQUIRED";
};

interface Props {
	order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

	const router = useRouter();

	const [isPaying, setIsPaying] = useState(false);

	const { shippingAddress } = order;

	const onOrderCompleted = async (details: OrderResponseBody) => {
		if (details.status !== "COMPLETED") {
			return alert("There are not pay on Paypal");
		}

		setIsPaying(true);

		try {
			const { data } = await tesloApi.post("/orders/pay", {
				transactionId: details.id,
				orderId: order._id
			});

			router.reload();
		} catch (error) {
			setIsPaying(true);

			console.log(error);
			alert("Error");
		}
	};

	return (
		<ShopLayout title='Order Summary' pageDescription='Summary of the Order'>
			<Typography variant='h1' component='h1'>
				Order: {order._id}
			</Typography>

			{order.isPaid ? (
				<Chip
					sx={{ my: 2, padding: 2 }}
					label='Paid Order'
					variant='outlined'
					color='success'
					icon={<CreditScoreOutlined />}
				/>
			) : (
				<Chip
					sx={{ my: 2, padding: 2 }}
					label='OutStanding'
					variant='outlined'
					color='error'
					icon={<CreditCardOffOutlined />}
				/>
			)}

			<Grid container sx={{ mt: 3 }}>
				<Grid item xs={12} sm={7}>
					<CartList products={order.orderItems} />
				</Grid>

				<Grid item xs={12} sm={5}>
					<Card className='summary-card'>
						<CardContent>
							<Typography variant='h2'>
								Summary ({order.numberOfItems} {order.numberOfItems > 1 ? "products" : "product"})
							</Typography>

							<Divider sx={{ my: 1 }} />

							<Box display='flex' justifyContent='space-between'>
								<Typography variant='subtitle1'>Delivery address</Typography>
							</Box>

							<Typography>
								{shippingAddress.firstName} {shippingAddress.lastName}
							</Typography>
							<Typography>
								{shippingAddress.address}{" "}
								{shippingAddress.address2 ? `, ${shippingAddress.address2}` : ""}
							</Typography>
							<Typography>
								{shippingAddress.city}, {shippingAddress.zip}
							</Typography>
							<Typography>{shippingAddress.country}</Typography>
							<Typography>{shippingAddress.phone}</Typography>

							<Divider sx={{ my: 1 }} />

							<OrderSummary
								orderValues={{
									numberOfItems: order.numberOfItems,
									subTotal: order.subTotal,
									total: order.total,
									tax: order.tax
								}}
							/>

							<Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
								<Box
									display='flex'
									justifyContent='center'
									className='fadeIn'
									sx={{ display: isPaying ? "flex" : "none" }}
								>
									<CircularProgress />
								</Box>

								<Box sx={{ display: isPaying ? "none" : "flex", flex: 1 }} flexDirection='column'>
									{order.isPaid ? (
										<Chip
											sx={{ my: 2, padding: 2 }}
											label='Paid Order'
											variant='outlined'
											color='success'
											icon={<CreditScoreOutlined />}
										/>
									) : (
										<PayPalButtons
											createOrder={(data, actions) => {
												return actions.order.create({
													purchase_units: [
														{
															amount: {
																value: `${order.total}`
															}
														}
													]
												});
											}}
											onApprove={(data, actions) => {
												return actions.order!.capture().then(details => {
													onOrderCompleted(details);
												});
											}}
										/>
									)}
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const { id = "" } = query as { id: string };

	const session: any = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: `/auth/login?p=/orders/${id}`,
				permanent: false
			}
		};
	}

	const order = await dbOrder.getOrderById(id);

	if (!order) {
		return {
			redirect: {
				destination: `/orders/history`,
				permanent: false
			}
		};
	}

	if (order.user !== session.user._id) {
		return {
			redirect: {
				destination: `/orders/history`,
				permanent: false
			}
		};
	}

	return {
		props: {
			order
		}
	};
};

export default OrderPage;
