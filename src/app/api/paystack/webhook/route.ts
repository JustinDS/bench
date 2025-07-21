import { UserRole } from "@/lib/enums";
import { createServiceRoleClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  // Generate HMAC from raw body
  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  // Compare with Paystack's signature
  if (hash !== signature) {
    console.warn("🚫 Webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const adminSupabase = await createServiceRoleClient();

  // Parse the event after signature check
  const event = JSON.parse(rawBody);

  console.log("event", event);

  console.error("event", event);

  console.error("event.event", event.event);

  console.error("event.data", event.data);

  console.error("event.data.metadata", event.data.metadata);

  console.error("event.data.metadata?.userId", event.data.metadata?.userId);

  if (
    event.event === "subscription.create" ||
    event.event === "invoice.payment_success"
  ) {
    const userId = event.data.metadata?.userId;

    if (userId) {
      await adminSupabase
        .from("profiles")
        .update({ role: UserRole.Premium })
        .eq("id", userId);

      console.log(`✅ Subscription activated for user: ${userId}`);
    }
  }

  return NextResponse.json({ received: true });
}
