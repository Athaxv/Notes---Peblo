import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LandingPage } from "@/components/landing/LandingPage";

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get("peblo_session")?.value === "1";

  if (hasSession) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
