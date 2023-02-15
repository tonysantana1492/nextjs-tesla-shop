import Link from "next/link";
import { NextPage } from "next";

import { Box, Typography } from "@mui/material";
import { RemoveShoppingCartOutlined } from "@mui/icons-material";

import { ShopLayout } from "../../components/layouts";

const EmptyPage: NextPage = () => {
  return (
    <ShopLayout
      title={"Cart Empty"}
      pageDescription={"No exists articles in the cart"}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginLeft={3}
        >
          <Typography>Your cart is empty</Typography>
          <Link href="/">
            <Typography variant="h6" color="secondary">
              Back To Home
            </Typography>
          </Link>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default EmptyPage;
