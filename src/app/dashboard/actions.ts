"use server";

import { UserRole } from "@/lib/enums";
import { createClient, createServiceRoleClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signUpForFree() {
  const adminSupabase = await createServiceRoleClient();
  const supabase = await createClient();

  //const { data } = await supabase.rpc("auth_role_check");

  await adminSupabase
    .from("profiles")
    .update({ role: UserRole.Free })
    .eq("id", (await supabase.auth.getUser()).data.user?.id);

  revalidatePath("/dashboard", "page");
  redirect("/dashboard");
}

export async function signUpForPremium() {
  const adminSupabase = await createServiceRoleClient();
  const supabase = await createClient();

  //const { data } = await supabase.rpc("auth_role_check");

  await adminSupabase
    .from("profiles")
    .update({ role: UserRole.Premium })
    .eq("id", (await supabase.auth.getUser()).data.user?.id);

  revalidatePath("/dashboard", "page");
  redirect("/dashboard");
}
