import { ChangeEvent, FC, KeyboardEvent, useContext, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { AppBar, Toolbar, Typography, Box, Button, IconButton, Badge, Input, InputAdornment } from "@mui/material";
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";

import { CartContext, UiContext } from "../../context";

export const Navbar: FC = () => {
	const route = useRouter();
	const { pathname } = route;

	const { toggleSideMenu } = useContext(UiContext);

	const [searchTerm, setSearchTerm] = useState("");
	const [isSearchVisible, setIsSearchVisible] = useState(false);

	const onChangeInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const onKeyInputHandler = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			onSearchTerm();
		}
	};

	const onSearchTerm = () => {
		if (searchTerm.trim().length === 0) return;
		route.push(`/search/${searchTerm}`);
	};

	const { numberOfItems } = useContext(CartContext);

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

				<Box
					sx={{
						display: isSearchVisible ? "none" : { xs: "none", sm: "block" }
					}}
					className='fadeIn'
				>
					<Link href='/category/men'>
						<Button color={pathname === "/category/men" ? "primary" : "info"}>Men</Button>
					</Link>
					<Link href='/category/women'>
						<Button color={pathname === "/category/women" ? "primary" : "info"}>Women</Button>
					</Link>
					<Link href='/category/kid'>
						<Button color={pathname === "/category/kid" ? "primary" : "info"}>Kids</Button>
					</Link>
				</Box>

				<Box flex={1} />

				{/* Medium Screen */}
				{isSearchVisible ? (
					<Input
						sx={{
							display: { xs: "none", sm: "flex" }
						}}
						className='fadeIn'
						autoFocus
						value={searchTerm}
						onChange={onChangeInputHandler}
						onKeyUp={onKeyInputHandler}
						type='text'
						placeholder='Buscar...'
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									onClick={() => {
										setIsSearchVisible(false);
									}}
								>
									<ClearOutlined />
								</IconButton>
							</InputAdornment>
						}
					/>
				) : (
					<IconButton
						sx={{ display: { xs: "none", sm: "flex" } }}
						className='fadeIn'
						onClick={() => {
							setIsSearchVisible(true);
						}}
					>
						<SearchOutlined />
					</IconButton>
				)}

				{/* Small Screen */}
				<IconButton sx={{ display: { xs: "flex", sm: "none" } }} onClick={toggleSideMenu}>
					<SearchOutlined />
				</IconButton>

				<Link href='/cart'>
					<IconButton>
						<Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color='secondary'>
							<ShoppingCartOutlined />
						</Badge>
					</IconButton>
				</Link>

				<Button onClick={toggleSideMenu}>Menu</Button>
			</Toolbar>
		</AppBar>
	);
};
