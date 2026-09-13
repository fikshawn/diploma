## SETUP AUTHENTICATION IN TANSTACK START APPLICATION
1. Install and setup prisma and create a user model with neccessary fields
2. Create session secret key in the .env file
```bash
SESSION_SECRET=WogXiagLfdDfhrTVF5H052Rbt4HHHcp8
```
3. Create "auth-validator.ts" file inside the src/lib//validators directory and put in the following content
```bash
import { z } from "zod";

export const signupSchema = z.object({
	username: z.string().min(1, "Name is required"),
	email: z.string().min(1, "Email is required"),
	password: z.string().min(1, "Password is required"),
});
```
4. **Install argon2**
```bash
npm install argon2
```
5. Create "server_functions" folder and copy the "auth" folder and all its content into the "server_funtions" folder
6. Create the login and register tsx pages and use tanstack form
7. **Update your Router Context in __root.tsx**
Import your fetchCurrentSession function. Use createRootRouteWithContext to define the TypeScript type, and use beforeLoad to resolve the data before the application renders.
```bash
// src/routes/__root.tsx
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { fetchCurrentSession } from '../path-to-your-auth-file'; // Update path

// 1. Define the global context type based on your function's return type
type RouterContext = {
  user: Awaited<ReturnType<typeof fetchCurrentSession>>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  // 2. Fetch the session on the server before loading any route
  beforeLoad: async () => {
    const user = await fetchCurrentSession();
    return { user }; // This becomes available everywhere as context.user
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
```
8. **Update your Main Router Config**
When you instantiate the router in your entry point, you must pass an empty or matching default context object so TypeScript knows it will be filled by the root loader.
```bash
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const router = createTanStackRouter({
		routeTree,
		context: {
			user: null,
		},
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
```
## To use the session inside Sub-Route Loaders (for Route Guards)
You can now read the global user data inside any page's beforeLoad or loader block to protect routes without re-fetching.
```bash
// src/routes/dashboard.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    // Access the globally resolved user context
    if (!context.user) {
      throw redirect({ to: '/login' });
    }
  },
});
```
## Inside Reacr Component(Client Side)
Use useRouteContext to pull the session variables into your UI safely.
```bash
// src/components navbar.tsx
import { useRouteContext } from '@tanstack/react-router';

export function Navbar() {
  // Pass strict: false if using outside the root rendering loop, or specify the route id
  const { user } = useRouteContext({ from: '__root__' });

  if (!user) return <button>Sign In</button>;

  return (
    <nav>
      <span>Hello, {user.username}</span>
      <span>Role: {user.role}</span>
    </nav>
  );
}
```
### CREATING AND USING AUTH MIDDLEWARE IN TANSTACK
1. **Create the Server-Side Middleware**
Create src/lib/middleware.ts and put the following content inside
```bash
import { createMiddleware } from '@tanstack/react-start';
import { createHttpError } from '@tanstack/react-start/server';
import { fetchCurrentSession } from './auth'; // Your session utility

export const authMiddleware = createMiddleware()
  // 1. Resolve or inject context variables into the middleware chain
  .server(async ({ next }) => {
    const user = await fetchCurrentSession();

    // 2. Enforce authentication
    if (!user) {
      throw createHttpError({
        statusCode: 401,
        statusText: 'Unauthorized: You must log in to access this resource.',
      });
    }

    // 3. Forward the validated user downstream to Server Functions
    return next({ context: { user } });
  });
```
2. **Guard Server Functions & Mutations**
You can now chain .middleware([authMiddleware]) directly onto any createServerFn. The inner handler will receive a strictly typed, guaranteed context.user.
```bash
import { createServerFn } from '@tanstack/react-start';
import { authMiddleware } from './middleware';

export const updateProfile = createServerFn({ method: 'POST' })
  .middleware([authMiddleware]) // 👈 Attaches the security layer
  .validator((data: { username: string }) => data)
  .handler(async ({ data, context }) => {
    // context.user is fully typed and guaranteed to exist here
    const { userId } = context.user; 
    
    // Perform secure database operation
    // await db.updateUser(userId, data.username);
    
    return { success: true };
  });
```
3. **Guard Client Routes (Route UI Protection)**
While server middleware secures data boundaries, you still need to prevent unauthorized users from viewing specific pages on the client. Enforce this inside your layout or leaf route options via beforeLoad.
```bash
// src/routes/dashboard.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  // Read from the global context created in your __root.tsx file
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: '/login',
        search: {
          // Optional: Redirect back to this page after successful login
          redirect: '/dashboard', 
        },
      });
    }
  },
});
```






