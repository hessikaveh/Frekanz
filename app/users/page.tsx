import AuthCheck from "../components/CustomComponents/AuthCheck";
import UserCard from "../components/CustomComponents/UserCard";
import { prisma } from "@/lib/prisma";

export default async function Users() {
  const users = await prisma.user.findMany({ where: { public_profile: true } });

  return (
    <AuthCheck>
      <div className="flex m-3">
        {users.map((user) => {
          return <UserCard key={user.id} {...user} />;
        })}
      </div>
    </AuthCheck>
  );
}
