import { errorResponse } from "@/functions/res/error_response";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { NextAuthOptions } from "next-auth";

// Define types for our callbacks
type TokenUser = {
  id: string;
  email: string;
  name: string;
};

// Extend JWT type to include our custom user property
interface ExtendedToken extends JWT {
  user?: TokenUser;
}

// Extend Session type to include our custom user property
interface ExtendedSession extends Session {
  user?: TokenUser;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            email: { label: "Email", type: "text", placeholder: "email@test.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            // Add logic here to look up the user from the credentials supplied
            const baseUrl = process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : "http://localhost:3000";
            
            try {
              const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                body: JSON.stringify({
                  email: credentials?.email,
                  password: credentials?.password,
                }),
                headers: { "Content-Type": "application/json" },
              });
  
              const user = await res.json();
              // If no error and we have user data, return it
              if (res.ok && user) {
                return {...user, id: user.id};
              }
              // If you return null then an error will be displayed advising the user to check their details.
              if (res.status === 401) {
                return errorResponse(401, "Invalid username or password");
              }
              // Redirect them to an error page
              if (res.status === 500) {
                throw new Error("Internal Server Error");
              }
            } catch (error) {
              console.error("Auth fetch error:", error);
            }
            // If the fetch fails, return null
            return null;
          }
        })
      ],
      pages: {
        signIn: "/login",
      },
      // Enhanced session configuration
      session: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
      // JWT configuration for faster validation
      jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
      // Enhance callbacks for better persistence
      callbacks: {
        async jwt({ token, user }: { token: ExtendedToken, user: any }) {
          // Add user info to the token when first signing in
          if (user) {
            token.user = {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          }
          return token;
        },
        
      },
      // Enable debug in development
      debug: process.env.NODE_ENV === "development",
      secret: process.env.NEXTAUTH_SECRET,
};
