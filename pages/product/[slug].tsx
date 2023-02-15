import { useState, useContext } from "react";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from 'next/router';

import { Button, Grid, Typography, Box, Chip } from "@mui/material";

import { dbProducts } from "../../database";

import { CartContext } from "../../context/cart/CartContext";

import { IProduct, ICartProduct, ISize } from "../../interfaces";
import { ShopLayout } from "../../components/layouts";
import { ItemCounter, ProductSlideShow, SizeSelector } from "../../components/products";

interface Props {
	product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
	const router  = useRouter();
	const { addProductToCart } = useContext(CartContext);

	const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
		_id: product._id,
		image: product.images[0],
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1
	});

	const onSelectedSize = (size: ISize) => {
		setTempCartProduct(prevCartProduct => ({
			...prevCartProduct,
			size
		}));
	};

	const onUpdateQuantity = ( quantity: number ) => {
		setTempCartProduct( currentProduct => ({
		  ...currentProduct,
		  quantity
		}));
	  }

	const onAddProduct = () => {
		if (!tempCartProduct.size) return;

		addProductToCart(tempCartProduct);
		router.push('/cart');
	};

	return (
		<ShopLayout title={product.title} pageDescription={product.description}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={7}>
					<ProductSlideShow images={product.images} />
				</Grid>

				<Grid item xs={12} sm={5}>
					<Box display='flex' flexDirection='column'>
						{/* Titles */}
						<Typography variant='h1' component='h1'>
							{product.title}
						</Typography>

						<Typography variant='subtitle1' component='h2'>
							${product.price}
						</Typography>

						{/* Cantidad */}
						<Box sx={{ my: 2 }}>
							<Typography variant='subtitle2'>Cantidad</Typography>
							<ItemCounter
								currentValue={tempCartProduct.quantity}
								updateQuantity={onUpdateQuantity}
								maxValue={product.inStock > 10 ? 10 : product.inStock}
							/>
							<SizeSelector
								// selectorSize={product.sizes[0]}
								sizes={product.sizes}
								selectedSize={tempCartProduct.size}
								onSelectedSize={onSelectedSize}
							/>
						</Box>

						{/* Add to Cart */}
						{product.inStock > 0 ? (
							<Button color='secondary' className='circular-btn' onClick={onAddProduct}>
								{tempCartProduct.size ? "Add to Cart" : "Select a size"}
							</Button>
						) : (
							<Chip label='Not available' color='error' variant='outlined' />
						)}

						{/* Description */}
						<Box sx={{ mt: 3 }}>
							<Typography variant='subtitle2'>Description</Typography>
							<Typography variant='body2'>{product.description}</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async ctx => {
	const productSlugs = await dbProducts.getAllProductSlugs();

	const paths = productSlugs!.map(({ slug }) => ({
		params: { slug }
	}));

	return {
		paths,
		fallback: "blocking"
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug = "" } = params as { slug: string };

	const product = await dbProducts.getProductBySlug(slug);

	// If the product not exist redirect the user to another url
	if (!product) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		};
	}

	return {
		props: {
			product
		},
		// Its is revalidate every 24h
		revalidate: 86400
	};
};

// SSR

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug = "" } = params as { slug: string };

//   const product = await dbProducts.getProductBySlug(slug);

//   // If the product not exist redirect the user to another url
//   if (!product) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       product,
//     },
//   };
// };

export default ProductPage;
