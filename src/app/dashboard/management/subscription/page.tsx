import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SubscriptionStatus } from "@/lib/enums";
import Premium from "@/app/components/subscribe/premium";
import Cancel from "@/app/components/subscribe/cancel";
import { SubscriptionData } from "@/lib/types/paystackTypes";
import { format } from "date-fns";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role,subscription_code")
    .eq("id", user?.id)
    .single();

  const paystackRes = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/paystack/subscription`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        subscriptionCode: profile?.subscription_code,
      }),
      cache: "no-store",
    }
  );

  const responseData: SubscriptionData = await paystackRes?.json();

  const status = responseData?.status;

  const subscriptionNextPayment = new Date(responseData.next_payment_date);

  const formatted = format(subscriptionNextPayment, "dd MMM yyyy");

  const isPremium =
    status === SubscriptionStatus.active ||
    status === SubscriptionStatus.nonRenewing;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {status !== SubscriptionStatus.active &&
      status !== SubscriptionStatus.nonRenewing ? (
        <Premium email={user?.email} userId={user?.id} />
      ) : null}

      {status === SubscriptionStatus.active ? <Cancel /> : null}

      {status === SubscriptionStatus.nonRenewing ? (
        <div>Your premium membership will expire on the {formatted}</div>
      ) : null}

      <div>
        {isPremium ? (
          <div>{"This is our premium content section"}</div>
        ) : (
          <div>{"This is our free content section"}</div>
        )}
      </div>
    </div>
  );
}
