import { useState, useContext } from "react";

import { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";

import { Box, Grid, Typography, TextField, Button, Chip } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { useForm } from "react-hook-form";

import { AuthLayout } from "../../components/layouts";
import { validations } from "../../utils";
import { AuthContext } from "../../context";

type FormData = {
	email: string;
	name: string;
	password: string;
};

const RegisterPage: NextPage = () => {
	const router = useRouter();
	const { registerUser } = useContext(AuthContext);

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>();

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const onRegisterForm = async ({ email, name, password }: FormData) => {
		setShowError(false);

		const { hasError, message } = await registerUser(email, name, password);

		if (hasError) {
			setShowError(true);
			setErrorMessage(message!);

			setTimeout(() => {
				setShowError(false);
			}, 3000);

			return;
		}

		await signIn("credentials", { email, password });

		// const destination = router.query.p?.toString() || '/';
		// router.replace(destination);
	};

	return (
		<AuthLayout title={""} description={""}>
			<form onSubmit={handleSubmit(onRegisterForm)} noValidate>
				<Box sx={{ width: 350, padding: "10px 20px" }}>
					<Grid container spacing={2}>
						<Grid item xs={12} display='flex' flexDirection='column'>
							<Typography variant='h1' component='h1'>
								Register account
							</Typography>

							<Chip
								label='Credential error'
								color='error'
								icon={<ErrorOutline />}
								sx={{ display: showError ? "flex" : "none" }}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								label='Full Name'
								variant='filled'
								fullWidth
								{...register("name", {
									required: "This field is required",
									minLength: { value: 2, message: "Minimum 2 characters" }
								})}
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								type='email'
								label='Email'
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
								Register
							</Button>
						</Grid>

						<Grid item xs={12} display='flex' justifyContent='end'>
							<Link href={router.query.p ? `/auth/login?p=${router.query.p}` : `/auth/login`}>
								<Typography
									variant='subtitle2'
									color='secondary'
									sx={{
										textDecorator: "underline"
									}}
								>
									Already have an account?
								</Typography>
							</Link>
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const session = await getSession({ req });

	const { p = '/' } = query;

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

export default RegisterPage;
