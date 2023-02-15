import { NextPage, GetServerSideProps } from "next";
import Link from "next/link";

import { Grid, Typography, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { ShopLayout } from "../../components/layouts";
import { getSession } from "next-auth/react";
import { dbOrder } from "database";
import { IOrder } from "interfaces";

const columns: GridColDef[] = [
	{ field: "id", headerName: "ID", width: 100 },
	{ field: "fullName", headerName: "Full Name", width: 300, sortable: false },
	{
		field: "paid",
		headerName: "Paid",
		description: "Show information if it is paid",
		width: 200,
		renderCell: (params: GridRenderCellParams): any => {
			return params.row.paid ? (
				<Chip color='success' label='Paid' variant='outlined' />
			) : (
				<Chip color='error' label='No paid' variant='outlined' />
			);
		}
	},
	{
		field: "order",
		headerName: "See order",
		width: 200,
		sortable: false,
		renderCell: (params: GridRenderCellParams): any => {
			return (
				<Link href={`/orders/${params.row.orderId}`}>
					<Typography sx={{ textDecoration: "underline" }} color='secondary'>See Order</Typography>
				</Link>
			);
		}
	}
];

interface Props {
	orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

  const rows = orders.map((order, index)=> (
    {
      id: index + 1,
      paid: order.isPaid,
      fullName: `${order.shippingAddress.firstName} ${ order.shippingAddress.lastName}`,
      orderId: order._id
    }
  ));

	return (
		<ShopLayout title='History of Orders' pageDescription="History of client's orders">
			<Typography variant='h1' component='h1'>
				<Grid container className="fadeIn">
					<Grid item xs={12} sx={{ height: 650, width: "100%" }}>
						<DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
					</Grid>
				</Grid>
			</Typography>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session: any = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: "/auth/login?p=/orders/history",
				permanent: false
			}
		};
	}

	const orders = await dbOrder.getOrdersByUser(session.user._id);

	return {
		props: {
			orders
		}
	};
};

export default HistoryPage;
