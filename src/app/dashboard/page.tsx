import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import HorizontalBarChart from "./client";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <HorizontalBarChart />
    </div>
  );
}
