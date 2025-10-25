import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import GPU from "./pageClient";

export default async function Admin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <GPU />
    </div>
  );
}
