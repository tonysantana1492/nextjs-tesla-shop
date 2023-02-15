import { FC, useContext } from "react";
import Link from "next/link";

import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

import { UiContext } from "../../context";

export const AdminNavbar: FC = () => {

	const { toggleSideMenu } = useContext(UiContext);

	return (
		<AppBar>
			<Toolbar>
				<Link href='/'>
					<Box display='flex' alignItems='center' justifyContent='center'>
						<Typography variant='h6' color='black'>
							Teslo |
						</Typography>
						<Typography sx={{ ml: 0.5 }} color='gray'>
							Shop
						</Typography>
					</Box>
				</Link>

				<Box flex={1} />

				<Button onClick={toggleSideMenu}>Menu</Button>
			</Toolbar>
		</AppBar>
	);
};
