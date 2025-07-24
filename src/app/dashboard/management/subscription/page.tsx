import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SubscriptionStatus } from "@/lib/enums";
import Premium from "@/app/components/subscribe/premium";
import Cancel from "@/app/components/subscribe/cancel";
import { format } from "date-fns";
import { SubscriptionData } from "@/lib/types/paystackTypes";
import { getURL } from "@/utils/functions/urlHelper";

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
    .select("subscription_code")
    .eq("id", user?.id)
    .single();

  const paystackRes = await fetch(`${getURL()}/api/paystack/subscription`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      subscriptionCode: profile?.subscription_code,
    }),
    cache: "no-store",
  });

  const responseData: SubscriptionData = await paystackRes?.json();

  const status = responseData?.status;

  const subscriptionNextPayment = new Date(responseData.next_payment_date);

  const formatted = format(subscriptionNextPayment, "dd MMM yyyy");

  const isPremium =
    status === SubscriptionStatus.active ||
    status === SubscriptionStatus.nonRenewing;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-600">
        Subscription Management
      </h1>
      {!isPremium ? <Premium email={user?.email} userId={user?.id} /> : null}

      {status === SubscriptionStatus.active ? <Cancel /> : null}

      {status === SubscriptionStatus.nonRenewing ? (
        <div>
          <p>Your premium membership will expire {formatted}</p>
        </div>
      ) : null}

      <div>
        {isPremium ? (
          <div>
            <div className="font-semibold text-gray-600">{`Card Details:`}</div>
            <div>
              {`Last 4 digits of card ${responseData.authorization.last4}`}
            </div>
            <div>
              {`Expiration ${responseData.authorization.exp_month}/${responseData.authorization.exp_year}`}
            </div>
          </div>
        ) : (
          <div>{"This is our free content section"}</div>
        )}
      </div>
    </div>
  );
}
