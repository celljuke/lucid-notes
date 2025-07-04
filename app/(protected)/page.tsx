import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NotesPage } from "@/modules/notes/components/notes-page";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return <NotesPage />;
}
