import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get("peblo_session")?.value === "1";
  redirect(hasSession ? "/dashboard" : "/login");
}
