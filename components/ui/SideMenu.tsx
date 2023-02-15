import { ChangeEvent, KeyboardEvent, useContext, useState } from "react";
import { useRouter } from "next/router";

import {
	Box,
	Divider,
	Drawer,
	IconButton,
	Input,
	InputAdornment,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader
} from "@mui/material";

import {
	AccountCircleOutlined,
	AdminPanelSettings,
	CategoryOutlined,
	ConfirmationNumberOutlined,
	EscalatorWarningOutlined,
	FemaleOutlined,
	LoginOutlined,
	MaleOutlined,
	SearchOutlined,
	VpnKeyOutlined
} from "@mui/icons-material";

import { AuthContext, UiContext } from "../../context";
import { DashboardOutlined } from '@mui/icons-material';

export const SideMenu = () => {
	const router = useRouter();

	const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
	const { user, isLoggedIn, logoutUser } = useContext(AuthContext);

	const [searchTerm, setSearchTerm] = useState("");

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
		navigateTo(`/search/${searchTerm}`);
	};

	const navigateTo = (url: string) => {
		toggleSideMenu();
		router.push(url);
	};

	return (
		<Drawer
			open={isMenuOpen}
			anchor='right'
			sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
			onClose={toggleSideMenu}
		>
			<Box sx={{ width: 250, paddingTop: 5 }}>
				<List>
					<ListItem>
						<Input
							autoFocus={true}
							value={searchTerm}
							onChange={onChangeInputHandler}
							onKeyUp={onKeyInputHandler}
							type='text'
							placeholder='Search...'
							endAdornment={
								<InputAdornment position='end'>
									<IconButton onClick={onSearchTerm}>
										<SearchOutlined />
									</IconButton>
								</InputAdornment>
							}
						/>
					</ListItem>

					{isLoggedIn && (
						<>
							<ListItem button>
								<ListItemIcon>
									<AccountCircleOutlined />
								</ListItemIcon>
								<ListItemText primary={"Profile"} />
							</ListItem>

							<ListItem button onClick={() => navigateTo("/orders/history")}>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={"My Orders"} />
							</ListItem>
						</>
					)}

					<ListItem
						button
						sx={{ display: { xs: "", sm: "none" } }}
						onClick={() => navigateTo("/category/men")}
					>
						<ListItemIcon>
							<MaleOutlined />
						</ListItemIcon>
						<ListItemText primary={"Men"} />
					</ListItem>

					<ListItem
						button
						sx={{ display: { xs: "", sm: "none" } }}
						onClick={() => navigateTo("/category/women")}
					>
						<ListItemIcon>
							<FemaleOutlined />
						</ListItemIcon>
						<ListItemText primary={"Women"} />
					</ListItem>

					<ListItem
						button
						sx={{ display: { xs: "", sm: "none" } }}
						onClick={() => navigateTo("/category/kid")}
					>
						<ListItemIcon>
							<EscalatorWarningOutlined />
						</ListItemIcon>
						<ListItemText primary={"Kid"} />
					</ListItem>

					{isLoggedIn ? (
						<ListItem button onClick={logoutUser}>
							<ListItemIcon>
								<LoginOutlined />
							</ListItemIcon>
							<ListItemText primary={"Salir"} />
						</ListItem>
					) : (
						<ListItem
							button
							onClick={() => {
								navigateTo(`/api/auth/signin?p=${router.asPath}`);
							}}
						>
							<ListItemIcon>
								<VpnKeyOutlined />
							</ListItemIcon>
							<ListItemText primary={"LogIn"} />
						</ListItem>
					)}

					{/* Admin */}

					{user?.role === "admin" && (
						<>
							<Divider />
							<ListSubheader>Admin Panel</ListSubheader>

							<ListItem button onClick={() => navigateTo('/admin/')}>
								<ListItemIcon>
									<DashboardOutlined />
								</ListItemIcon>
								<ListItemText primary={"Dashboard"} />
							</ListItem>

							<ListItem button onClick={() => navigateTo('/admin/products')}>
								<ListItemIcon>
									<CategoryOutlined />
								</ListItemIcon>
								<ListItemText primary={"Products"} />
							</ListItem>

							<ListItem button onClick={() => navigateTo('/admin/orders')}>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={"Orders"} />
							</ListItem>

							<ListItem button onClick={() => navigateTo('/admin/users')}>
								<ListItemIcon>
									<AdminPanelSettings />
								</ListItemIcon>
								<ListItemText primary={"Users"} />
							</ListItem>
						</>
					)}
				</List>
			</Box>
		</Drawer>
	);
};
