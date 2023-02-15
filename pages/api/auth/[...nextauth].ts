import { dbUsers } from "database";
import NextAuth, { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		Credentials({
			name: "Credentials",

			credentials: {
				email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
				password: { label: "Password", type: "password", placeholder: "Password" }
			},
			async authorize(credentials) {
				return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
			}
		}),

		GithubProvider({
			clientId: process.env.GITHUB_ID || "",
			clientSecret: process.env.GITHUB_SECRET || ""
		})
	],
  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    maxAge: 2592000, // the session is open during 3 days
    strategy: 'jwt',
    updateAge: 86400  //The token updates each 24 hours
  },
	// Callbacks
	callbacks: {
		async jwt({ token, account, user }) {
			
			if (account) {
				token.accessToken = account.access_token;

				switch (account.type) {
					case "oauth":
            await dbUsers.oAUthToDbUser(user?.email || '', user?.name || '')
						break;

					case "credentials":
						token.user = user;
						break;
				}
			}

			return token;
		},
		async session({ session, token, user }: { session: any; token: any; user: any }) {
			session.accessToken = token.accessToken;
			session.user = token.user;

			return session;
		}
	}
});
