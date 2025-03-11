import { redirect } from "next/navigation";

/**
 * Litepaper index page
 * Redirects to the STAB3L_Litepaper page
 */
export default function LitepaperIndexPage() {
  redirect("/docs/litepaper/STAB3L_Litepaper");
} 