import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ChartInputManager } from "../components/chartInputManager/chartInputManager";

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
    .select(
      "role,subscription_code,subscription_expires_at,subscription_status"
    )
    .eq("id", user?.id)
    .single();

  const status = profile?.subscription_status;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <ChartInputManager />
    </div>
  );
}
