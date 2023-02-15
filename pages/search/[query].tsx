import { NextPage, GetServerSideProps } from "next";
import { Typography, Box } from "@mui/material";

import { ProductList } from "../../components/products";
import { ShopLayout } from "../../components/layouts";
import { getProductByQuery, getAllProducts } from "../../database/dbProducts";

import { IProduct } from "../../interfaces";

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const QueryPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout
      title="Teslo-Shop - Search"
      pageDescription="Find best products"
    >
      {/* component="h1" is important for the bots knows that this is the title of my page */}
      <Typography variant="h1" component="h1">
        Search products
      </Typography>
      {foundProducts ? (
        <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">
          Term: {query}
        </Typography>
      ) : (
        <Box display="flex">
          <Typography variant="h2" sx={{ mb: 1 }}>
            Products no found
          </Typography>
          <Typography variant="h2" color="secondary" sx={{ ml: 1 }} textTransform='capitalize'>
            {query}
          </Typography>
        </Box>
      )}

      <ProductList products={products} />
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (query.trim().length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  //if there are not products we show some other products
  let products = await getProductByQuery(query);
  const foundProducts = products.length > 0;

  if (!foundProducts) {
    // products = await getAllProducts();
    products = await getProductByQuery(query);
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};

export default QueryPage;
