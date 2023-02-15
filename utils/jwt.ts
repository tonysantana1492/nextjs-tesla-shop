import jwt, { Secret, JwtPayload } from "jsonwebtoken";

export const signToken = (_id: string, email: string) => {
	const secretKey: Secret = String(process.env.JWT_SECRET);

	if (!secretKey) {
		throw new Error("JWT seed not found. Please check your env variables");
	}

	return jwt.sign({ _id, email }, secretKey, { expiresIn: "30d" });
};

export const isValidToken = (token: string): Promise<string> => {
	const secretKey: Secret = String(process.env.JWT_SECRET);

	if (!secretKey) {
		throw new Error("JWT seed not found. Please check your env variables");
	}

	if(token.length <= 10) {
		return Promise.reject('JWT is not valid');
	}

	return new Promise((resolve, reject) => {
		try {
			jwt.verify(token, secretKey, (err, payload) => {
				if (err) return reject("JWT not valid");

				const { _id } = payload as { _id: string };

				resolve(_id);
			});
		} catch (error) {
			reject("JWT not valid");
		}
	});
};
