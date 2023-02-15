import { useState, useEffect } from "react";
import { NextPage } from "next";

import useSWR from "swr";
import { PeopleOutline } from "@mui/icons-material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Grid, MenuItem, Select } from "@mui/material";

import { AdminLayout } from "components/layouts";
import { IUser } from "interfaces";
import { tesloApi } from "api";

const UsersPage: NextPage = () => {
	const { data, error } = useSWR<IUser[]>("/api/admin/users");
	const [users, setUsers] = useState<IUser[]>([]);

	useEffect(() => {
		if (data) {
			setUsers(data);
		}
	}, [data]);

	if (!data && !error) {
		return <></>;
	}

	const onRoleUpdated = async (userId: string, newRole: string) => {
		
		const previousUser = [...users];
		const updatedUsers = users.map(user => ({ ...user, role: userId === user._id ? newRole : user.role }));

		setUsers(updatedUsers);

		try {
			await tesloApi.put("/admin/users", { userId, role: newRole });
		} catch (error) {
			setUsers(previousUser);
			console.log(error);
			alert("The user could not be updated");
		}
	};

	const columns: GridColDef[] = [
		{ field: "email", headerName: "Email", width: 250 },
		{ field: "name", headerName: "Name", width: 300 },
		{
			field: "role",
			headerName: "Role",
			width: 300,
			renderCell: ({ row }: GridRenderCellParams): any => {
				return (
					<Select
						value={row.role}
						label='Role'
						sx={{ width: "300px" }}
						onChange={({ target }) => onRoleUpdated(row.id, target.value)}
					>
						<MenuItem value='admin'> Admin </MenuItem>
						<MenuItem value='client'> Client </MenuItem>
						<MenuItem value='super-user'> Super User </MenuItem>
						<MenuItem value='SEO'> SEO </MenuItem>
					</Select>
				);
			}
		}
	];

	const rows = users!.map(user => ({
		id: user._id,
		email: user.email,
		name: user.name,
		role: user.role
	}));

	return (
		<AdminLayout title={"Users"} subTitle={"Users maintenance"} icon={<PeopleOutline />}>
			<Grid container className='fadeIn'>
				<Grid item xs={12} sx={{ height: 650, width: "100%" }}>
					<DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export default UsersPage;
