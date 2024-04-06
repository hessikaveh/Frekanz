import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";
import Link from "next/link";
import { DeleteProfile } from "./DeleteProfile";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }
  const currentUserEmail = session?.user?.email!;
  const user = await prisma.user.findUnique({
    where: {
      email: currentUserEmail,
    },
  });
  return (
    <div className="items-center justify-between flex flex-col">
      <ProfileForm user={user} />
      <Link className="btn" href="/users">
        See public users
      </Link>

      <DeleteProfile user={user} />
    </div>
  );
}
