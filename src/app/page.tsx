import { redirect } from 'next/navigation';
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/footer";

/**
 * Home page component
 * Redirects to the documentation page
 */
export default function HomePage() {
  redirect('/docs');
  
  // This part won't be executed due to the redirect
  return null;
} 