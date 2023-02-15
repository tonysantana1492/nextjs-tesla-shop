import { FC, useContext } from "react";
import Link from "next/link";

import { Box, Button, CardActionArea, CardMedia, Grid, Typography } from "@mui/material";

import { CartContext } from "../../context/cart";
import { ItemCounter } from "../products";
import { ICartProduct } from "../../interfaces";
import { IOrderItem } from '../../interfaces';

interface Props {
	editable?: boolean;
	products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

	const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

	const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
		product.quantity = newQuantityValue;
		updateCartQuantity(product);
	};

	const productsToShow = products ?? cart;

	return (
		<>
			{productsToShow.map(product => (
				<Grid container key={product.slug + product.size} spacing={2} sx={{ mb: 2 }}>
					<Grid item xs={3}>
						{/* TODO:       */}
						<Link href={`/product/${product.slug}`}>
							<CardActionArea>
								<CardMedia
									image={product.image}
									component='img'
									sx={{ borderRadius: "5px" }}
								/>
							</CardActionArea>
						</Link>
					</Grid>

					<Grid item xs={7}>
						<Box display='flex' flexDirection='column'>
							<Typography variant='body1'>{product.title}</Typography>
							<Typography variant='body1'>
								Talla: <strong>{product.size}</strong>
							</Typography>
							{editable ? (
								<ItemCounter
									currentValue={product.quantity}
									maxValue={10}
									updateQuantity={value => onNewCartQuantityValue(product as ICartProduct, value)}
								/>
							) : (
								<Typography variant='h6'>{`${product.quantity} ${
									product.quantity > 1 ? "products" : "product"
								}`}</Typography>
							)}
						</Box>
					</Grid>

					<Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
						<Typography variant='subtitle1'>{`$${product.price}`}</Typography>
						{editable && (
							<Button variant='text' color='secondary' onClick={()=> removeCartProduct(product as ICartProduct)}>
								Remove
							</Button>
						)}
					</Grid>
				</Grid>
			))}
		</>
	);
};
