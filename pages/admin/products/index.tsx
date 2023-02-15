import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";

import useSWR from "swr";
import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { CardMedia, Grid, Typography, Box, Button } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { IProduct } from "../../../interfaces/products";
import { AdminLayout } from "../../../components/layouts";

const columns: GridColDef[] = [
	{
		field: "img",
		headerName: "Picture",
		renderCell: ({ row }: GridRenderCellParams) => {
			return (
				<a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
					<CardMedia alt={row.title} component='img' className='fadeIn' image={row.img} />
				</a>
			);
		}
	},
	{
		field: "title",
		headerName: "Title",
		width: 250,
		renderCell: ({ row }: GridRenderCellParams) => {
			return (
				<Link href={`/admin/products/${row.slug}`}>
					<Typography sx={{ textDecoration: "underline" }}>{row.title}</Typography>
				</Link>
			);
		}
	},
	{ field: "gender", headerName: "Gender" },
	{ field: "type", headerName: "Type" },
	{ field: "inStock", headerName: "Stock" },
	{ field: "price", headerName: "Price" },
	{ field: "sizes", headerName: "Sizes", width: 250 }
];

const ProductsPage: NextPage = () => {
	const { data, error } = useSWR<IProduct[]>("/api/admin/products");
	const [products, setProducts] = useState<IProduct[]>([]);

	useEffect(() => {
		if (data) {
			setProducts(data);
		}
	}, [data]);

	if (!data && !error) {
		return <></>;
	}

	const rows = products!.map(product => ({
		id: product._id,
		img: product.images[0],
		title: product.title,
		gender: product.gender,
		type: product.type,
		inStock: product.inStock,
		price: product.price,
		sizes: product.sizes.join(", "),
		slug: product.slug
	}));

	return (
		<AdminLayout title={`Products (${data?.length})`} subTitle={"Products maintenance"} icon={<CategoryOutlined />}>
			<Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
				<Button startIcon={<AddOutlined />} color='secondary' href='/admin/products/new'>
					Add Product
				</Button>
			</Box>
			<Grid container className='fadeIn'>
				<Grid item xs={12} sx={{ height: 650, width: "100%" }}>
					<DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export default ProductsPage;
