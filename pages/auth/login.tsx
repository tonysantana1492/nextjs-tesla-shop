import { useState, useContext, useEffect } from "react";

import { NextPage, GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession, signIn, getProviders } from "next-auth/react";

import { Box, Grid, Typography, TextField, Button, Chip, Divider } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { useForm } from "react-hook-form";

import { AuthLayout } from "../../components/layouts";
import { validations } from "../../utils";

type FormData = {
	email: string;
	password: string;
};

const LoginPage: NextPage = () => {
	const router = useRouter();

	// const { loginUser } = useContext(AuthContext);

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>();

	const [showError, setShowError] = useState(false);

	const [providers, setProviders] = useState<any>({});

	useEffect(() => {
		getProviders().then(prov => {
			setProviders(prov);
		});
	}, []);

	const onLoginUser = async ({ email, password }: FormData) => {
		setShowError(false);

		// const isValidLogin = await loginUser(email, password);

		// if (!isValidLogin) {
		// 	setShowError(true);
		// 	setTimeout(() => {
		// 		setShowError(false);
		// 	}, 3000);
		// 	return;
		// }
		// const destination = router.query.p?.toString() || '/';
		// router.replace(destination);

		await signIn("credentials", { email, password });
	};

	return (
		<AuthLayout title={""} description={""}>
			<form onSubmit={handleSubmit(onLoginUser)} noValidate>
				<Box sx={{ width: 350, padding: "10px 20px" }}>
					<Grid container spacing={2}>
						<Grid item xs={12} display='flex' flexDirection='column'>
							<Typography variant='h1' component='h1'>
								Login account
							</Typography>
							<Chip
								label='Error on user / password'
								color='error'
								icon={<ErrorOutline />}
								className='fadeIn'
								sx={{ display: showError ? "flex" : "none" }}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								autoFocus
								type='email'
								label='Mail'
								variant='filled'
								autoComplete='username'
								fullWidth
								{...register("email", {
									required: "This field is required",
									validate: val => validations.isEmail(val)
								})}
								error={!!errors.email}
								helperText={errors.email?.message}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								type='password'
								label='Password'
								variant='filled'
								autoComplete='current-password'
								fullWidth
								{...register("password", {
									required: "This field is required",
									minLength: {
										value: 6,
										message: "Minimum 6 characters"
									}
								})}
								error={!!errors.password}
								helperText={errors.password?.message}
							/>
						</Grid>

						<Grid item xs={12}>
							<Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>
								Login
							</Button>
						</Grid>

						<Grid item xs={12} display='flex' justifyContent='end'>
							<Link href={router.query.p ? `/auth/register?p=${router.query.p}` : `/auth/register`}>
								<Typography
									variant='subtitle2'
									color='secondary'
									sx={{
										textDecorator: "underline"
									}}
								>
									No have an account yet?
								</Typography>
							</Link>
						</Grid>

						<Grid item xs={12} display='flex' justifyContent='end' flexDirection='column'>
							<Box display='flex' justifyContent='space-between' alignItems='center' sx={{ my: 1 }}>
								<Divider sx={{ width: "40%", mr: 1 }} />
								<Typography>OR</Typography>
								<Divider sx={{ width: "40%", ml: 1 }} />
							</Box>

							{Object.values(providers)
								.filter((provider: any) => provider.id !== "credentials")
								.map((provider: any) => {
									return (
										<Button
											key={provider.id}
											variant='outlined'
											size='large'
											fullWidth
											color='secondary'
											sx={{ mb: 1, borderRadius: '30px' }}
											onClick={() => signIn(provider.id)}
										>
											{provider.name}
										</Button>
									);
								})}
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const session = await getSession({ req });

	const { p = "/" } = query;

	if (session) {
		return {
			redirect: {
				destination: p.toString(),
				permanent: false
			}
		};
	}

	return {
		props: {}
	};
};

export default LoginPage;
