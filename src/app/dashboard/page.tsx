import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Dashboard } from "@/components/dashboard/dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    "Usuário";
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  return <Dashboard userId={user.id} email={user.email ?? ""} name={name} avatarUrl={avatarUrl} />;
}
