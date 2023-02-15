import { useEffect, useState } from "react";
import { NextPage } from "next";

import useSWR from "swr";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { AdminLayout } from "components/layouts";
import { IOrder } from "../../../interfaces/order";
import { IUser } from "interfaces";

const columns: GridColDef[] = [
	{ field: "id", headerName: "Order ID", width: 250 },
	{ field: "email", headerName: "Email", width: 250 },
	{ field: "name", headerName: "Full Name", width: 250 },
	{ field: "total", headerName: "Total amount", width: 250 },
	{
		field: "isPaid",
		headerName: "Paid",
		width: 250,
		renderCell: ({ row }: GridRenderCellParams) => {
			return row.isPaid ? (
				<Chip variant='outlined' label='Paid' color='success' />
			) : (
				<Chip variant='outlined' label='Pending' color='error' />
			);
		}
	},
	{
		field: "noProducts",
		headerName: "No. Products",
		align: "center",
		width: 150,
		renderCell: ({ row }: GridRenderCellParams) => {
			return (				
				<a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>
					<Typography sx={{ textDecoration: "underline" }} color='secondary'>See Order</Typography>				
				</a>
			);
		}
	},
	{
		field: "createdAt",
		headerName: "Created At",
		width: 300
	}
];

const OrdersPage: NextPage = () => {
	const { data, error } = useSWR<IOrder[]>("/api/admin/orders");
	const [orders, setOrders] = useState<IOrder[]>([]);

	useEffect(() => {
		if (data) {
			setOrders(data);
		}
	}, [data]);

	if (!data && !error) {
		return <></>;
	}

	const rows = orders!.map(order => ({
		id: order._id,
		email: (order.user as IUser).email,
		name: (order.user as IUser).name,
		total: order.total,
		isPaid: order.isPaid,
		noProducts: order.numberOfItems,
		createdAt: order.createdAt
	}));

	return (
		<AdminLayout title={"Orders"} subTitle={"Order maintenance"} icon={<ConfirmationNumberOutlined />}>
			<Grid container className='fadeIn'>
				<Grid item xs={12} sx={{ height: 650, width: "100%" }}>
					<DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export default OrdersPage;
