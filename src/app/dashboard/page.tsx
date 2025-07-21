import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SubscriptionStatus, UserRole } from "@/lib/enums";
import Premium from "../components/subscribe/premium";
import Cancel from "../components/subscribe/cancel";

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

  let status = SubscriptionStatus.inactive;
  if (profile) {
    const paystackRes = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/paystack/subscription/${profile?.subscription_code}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await paystackRes.json();

    status = data?.status;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {status !== SubscriptionStatus.active ? (
        <Premium email={user?.email} userId={user?.id} />
      ) : null}

      {status === SubscriptionStatus.active ? <Cancel /> : null}

      <div>
        {profile?.role === UserRole.Free ? (
          <div>{"This is our free content section"}</div>
        ) : (
          <div>{"This is our premium content section"}</div>
        )}
      </div>
    </div>
  );
}
