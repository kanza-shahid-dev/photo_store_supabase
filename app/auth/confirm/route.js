import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("next");
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) =>
          cookieStore.set({ name, value, ...options }),
        clear: (name, options) => cookieStore.delete({ name, ...options }),
      },
    }
  );

  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token: token_hash,
      type: type,
    });
    if (!error) {
      return NextResponse.redirect(next);
    }
  }

  return NextResponse.redirect("/error");
}
