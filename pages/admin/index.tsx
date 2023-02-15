import { useState, useEffect } from 'react';

import useSWR from "swr";
import {
	AttachMoneyOutlined,
	CreditCardOutlined,
	DashboardOutlined,
	CreditCardOffOutlined,
	GroupOutlined,
	CategoryOutlined,
	ProductionQuantityLimitsOutlined,
	CancelPresentationOutlined,
	AccessTimeOutlined
} from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { SummaryTile } from "components/admin";
import { AdminLayout } from "components/layouts";
import { DashboardSummaryResponse } from "interfaces";

const DashboardPage = () => {
	const { data, error } = useSWR<DashboardSummaryResponse>("/api/admin/dashboard", {
		refreshInterval: 30 * 1000 // 30 seconds
	});

	const [refreshIn, setRefreshIn] = useState(30);
	
	useEffect(()=>{

		const interval = setInterval(()=>{
			setRefreshIn((refreshIn) => refreshIn > 0 ? refreshIn - 1 : 30);
		}, 1000);
		
		return () => clearInterval(interval);

	},[])

	if(!error && !data) {
		return  <></>;
	}

	if(error) {
		return <Typography>Error loading the information</Typography>
	}

	const {
		numberOfOrders,
		paidOrders,
		notpaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory,
	} = data!;


	return (
		<AdminLayout title='Dashboard' subTitle='General statistics' icon={<DashboardOutlined />}>
			<Grid container spacing={2}>
				<SummaryTile
					title={numberOfOrders}
					subTitle='Total Orders'
					icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTile
					title={paidOrders}
					subTitle='Paid Orders'
					icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTile
					title={notpaidOrders}
					subTitle='Pending Orders'
					icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTile
					title={numberOfClients}
					subTitle='Clients'
					icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTile
					title={numberOfProducts}
					subTitle='Products'
					icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTile
					title={productsWithNoInventory}
					subTitle='Without Exists'
					icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTile
					title={lowInventory}
					subTitle='Low Stock'
					icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTile
					title={refreshIn}
					subTitle='Update in:'
					icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
				/>
			</Grid>
		</AdminLayout>
	);
};

export default DashboardPage;
