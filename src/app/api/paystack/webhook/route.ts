import { PaystackEvents, SubscriptionStatus, UserRole } from "@/lib/enums";
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
  const customerCode = event.data.customer?.customer_code;

  //comes in with charge.success first which has the metadata - update customer code here
  //then comes in with subscription.create which has all the items in to update, but does not have
  //meta data - look for customercode here and update
  //test
  if (event.event === PaystackEvents.SUBSCRIPTION_CREATE) {
    const subscriptionStartedAt = new Date(
      event.data.paid_at || event.data.createdAt
    );
    const baseExpiry = add(subscriptionStartedAt, { months: 1 });
    const graceDays = 3; // Or fetch from DB if user-specific
    const subscriptionExpiresAt = add(baseExpiry, { days: graceDays });

    await adminSupabase
      .from("profiles")
      .update({
        role: UserRole.Premium,
        subscription_code: event.data.subscription_code,
        subscription_started_at: subscriptionStartedAt,
        subscription_expires_at: subscriptionExpiresAt,
        email_token: event.data.email_token,
        subscription_status: SubscriptionStatus.active,
      })
      .eq("customer_code", customerCode);

    console.log(`✅ Subscription activated for customerCode: ${customerCode}`);
  } else if (PaystackEvents.PAYMENT_SUCCESSFUL) {
    if (userId) {
      await adminSupabase
        .from("profiles")
        .update({
          customer_code: customerCode,
        })
        .eq("id", userId);

      console.log(`✅ Payment successful: ${userId}`);
    }
  } else if (event.event === "subscription.not_renew") {
    await adminSupabase
      .from("profiles")
      .update({ subscription_status: SubscriptionStatus.nonRenewing })
      .eq("customer_code", customerCode);

    console.log(`✅ Subscription cancelled for user: ${userId}`);
  }

  return NextResponse.json({ received: true });
}
