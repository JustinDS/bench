import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Admin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col">
      <Link href={"admin/gpu"}>Add GPU</Link>
      <Link href={"admin/cpu"}>Add CPU</Link>
      <Link href={"admin/ram"}>Add RAM</Link>
    </div>
  );
}
