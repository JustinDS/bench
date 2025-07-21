import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient(); // your Supabase client
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get subscription_code from DB
  const { data: subscription_code, error } = await (await supabase)
    .from("profiles")
    .select("subscription_code")
    .eq("id", user.id)
    .single();

  if (error || !subscription_code) {
    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 }
    );
  }

  // Call Paystack
  const res = await fetch("https://api.paystack.co/subscription/disable", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: subscription_code,
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: result.message }, { status: res.status });
  }

  // Optional: update status in DB
  await (await supabase)
    .from("profiles")
    .update({ subscription_status: "cancelled" })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}
