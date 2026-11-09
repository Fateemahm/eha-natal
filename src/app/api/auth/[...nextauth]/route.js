
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    console.log("Missing email or password");
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: credentials.email,
    },
  });

  console.log("User found:", Boolean(user));

  if (!user) {
    return null;
  }

  console.log("Stored password hash exists:", Boolean(user.password));

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  console.log("Password is valid:", isPasswordValid);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: String(user.id),
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
  };
}
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };




























// import CredentialsProvider from "next-auth/providers/credentials";
// providers: [
//   CredentialsProvider({
//     // The name to display on the sign in form (e.g. "Sign in with...")
//     name: "Credentials",
//     // `credentials` is used to generate a form on the sign in page.
//     // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//     // e.g. domain, username, password, 2FA token, etc.
//     // You can pass any HTML attribute to the <input> tag through the object.
//     credentials: {
//       username: { label: "Username", type: "text", placeholder: "jsmith" },
//       password: { label: "Password", type: "password" }
//     },
//     async authorize(credentials, req) {
//       // Add logic here to look up the user from the credentials supplied
//       const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

//       if (user) {
//         // Any object returned will be saved in `user` property of the JWT
//         return user
//       } else {
//         // If you return null then an error will be displayed advising the user to check their details.
//         return null

//         // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
//       }
//     }
//   })
// ]