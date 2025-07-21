import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { signUpForFree } from "./actions";
import { SubscriptionStatus, UserRole } from "@/lib/enums";
import Premium from "../components/subscribe/premium";
import Cancel from "../components/subscribe/cancel";
import ReActivate from "../components/subscribe/reActivate";

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
    .select("role,subscription_status")
    .eq("id", user?.id)
    .single();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <form>
        <p>Hello {user.email}</p>
        <div className="grid grid-cols-1 gap-4 py-6">
          <button
            formAction={signUpForFree}
            className="p-4 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
          >
            Sign up for free
          </button>
        </div>
      </form>

      {profile?.subscription_status === SubscriptionStatus.inactive ? (
        <Premium email={user?.email} userId={user?.id} />
      ) : null}

      {profile?.subscription_status === SubscriptionStatus.active ? (
        <Cancel />
      ) : null}

      {profile?.subscription_status === SubscriptionStatus.cancelled ||
      profile?.subscription_status === SubscriptionStatus.expired ||
      profile?.subscription_status === SubscriptionStatus.grace ||
      profile?.subscription_status === SubscriptionStatus.paused ? (
        <ReActivate />
      ) : null}

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
