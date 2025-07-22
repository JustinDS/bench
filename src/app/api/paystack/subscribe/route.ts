// app/api/paystack/initialize/route.ts
import { getURL } from "@/utils/functions/urlHelper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, userId } = body;

  console.log("email", email);
  console.log("userId", userId);

  try {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: 800 * 100,
        plan: process.env.SUBSCRIPTION_PLANS,
        metadata: { userId: userId },
        callback_url: `${getURL()}/dashboard/verify`,
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.data?.authorization_url) {
      throw new Error(result.message || "Failed to initialize transaction");
    }

    return NextResponse.json({ url: result.data.authorization_url });
  } catch (err: unknown) {
    console.error("Paystack initialization error:", err);
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
  }
}
