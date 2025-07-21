import { SubscriptionStatus, UserRole } from "@/lib/enums";
import { createServiceRoleClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { add } from "date-fns";

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

  const userId = event.data.metadata?.userId;

  if (
    event.event === "subscription.create" ||
    event.event === "invoice.payment_success" ||
    event.event === "charge.success"
  ) {
    const subscriptionStartedAt = new Date(
      event.data.paid_at || event.data.createdAt
    );
    const baseExpiry = add(subscriptionStartedAt, { months: 1 });
    const graceDays = 3; // Or fetch from DB if user-specific
    const subscriptionExpiresAt = add(baseExpiry, { days: graceDays });

    if (userId) {
      await adminSupabase
        .from("profiles")
        .update({
          role: UserRole.Premium,
          subscription_code: event.data.subscription_code,
          subscription_started_at: subscriptionStartedAt,
          subscription_expires_at: subscriptionExpiresAt,
          email_token: event.data.authorization?.email_token,
          subscription_status: SubscriptionStatus.active,
        })
        .eq("id", userId);

      console.log(`✅ Subscription activated for user: ${userId}`);
    }
  } else if (event.event === "subscription.not_renew") {
    await adminSupabase
      .from("profiles")
      .update({ subscription_status: "cancelled" })
      .eq("id", userId);

    console.log(`✅ Subscription cancelled for user: ${userId}`);
  }

  return NextResponse.json({ received: true });
}
