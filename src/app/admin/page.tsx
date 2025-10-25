import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminClient from "./pageClient";
import { randomUUID } from "crypto";

export default async function Admin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <AdminClient key={randomUUID()} />;
}
