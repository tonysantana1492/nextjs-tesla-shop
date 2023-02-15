import React from "react";

import { NextPage } from 'next';
import { Typography, Box } from "@mui/material";
import { ShopLayout } from "../components/layouts";


const Custom404: NextPage = () => {
  return (
    <ShopLayout title="Page not Found" pageDescription="Nothing to Show">
      <Box
        display="flex"        
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{flexDirection: {xs: 'column', sm: 'row'}}}
      >
        <Typography variant="h1" component="h1" fontSize={80} fontWeight={200}>
          404 |
        </Typography>
        <Typography marginLeft={2}> Page not Found </Typography>
      </Box>
    </ShopLayout>
  );
};

export default Custom404;
