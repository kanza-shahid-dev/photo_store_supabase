import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
          const response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
          return response;
        },
        remove: (name, options) => {
          res.cookies.delete({ name, ...options });
          const response = NextResponse.next({
            request: { headers: req.headers },
          });
          response.cookies.delete({ name, ...options });
          return response;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/photos", req.url));
  }

  if (!user && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/", "/photos"],
};
