import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error } = await (await supabase)
    .from("profiles")
    .select("subscription_code, email_token")
    .eq("id", user.id)
    .single();

  if (error || !profile?.subscription_code || !profile?.email_token) {
    return NextResponse.json(
      { error: "Subscription info missing" },
      { status: 400 }
    );
  }

  console.log("profile reactivate", profile);

  try {
    const res = await fetch("https://api.paystack.co/subscription/enable", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: profile.subscription_code,
        token: profile.email_token,
      }),
    });

    const result = await res.json();

    console.log("result", result);

    if (!res.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: res.status }
      );
    }

    await (await supabase)
      .from("profiles")
      .update({ subscription_status: "active" })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
  }
}
