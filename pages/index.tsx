import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Typography } from "@mui/material";

import { useProducts } from "../hooks";
import { ProductList } from "../components/products";
import { ShopLayout } from "../components/layouts";
import { FullScreenLoading } from "../components/ui";

const HomePage: NextPage = () => {

  const session = useSession();

  const { products, isLoading } = useProducts("/products", {});

  return (
    <ShopLayout title="Teslo-Shop - Home" pageDescription="Find best products">
      {/* component="h1" is important for the bots knows that this is the title of my page */}
      <Typography variant="h1" component="h1">
        Store
      </Typography>

      <Typography variant="h2" sx={{ mb: 1 }}>
        All products
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default HomePage;
