import { getServerSession } from "next-auth";
import UserCard from "../components/CustomComponents/UserCard";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Users() {
  const users = await prisma.user.findMany();
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div className="flex m-3">
      {users.map((user) => {
        return <UserCard key={user.id} {...user} />;
      })}
    </div>
  );
}
