import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminClient from "./pageClient";

export default async function Admin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <AdminClient key={1} />;
}
