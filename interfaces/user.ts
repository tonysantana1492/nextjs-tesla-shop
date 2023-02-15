export type IRole = "admin" | "client";

export interface IUser {
	_id: string;
	name: string;
	email: string;
	password?: string;
	role: string;

	createdAt?: string;
	updatedAt?: string;
}
