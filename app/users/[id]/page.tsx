import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  return { title: `User profile of ${user?.name}` };
}

export default async function UserProfile({ params }: Props) {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  const { name, bio, image, id } = user ?? {};
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div>
      <h1>{name}</h1>

      <Image
        src={image ?? "/peeps.svg"}
        alt={`${name}'s profile`}
        width={128}
        height={128}
      />

      <h3>Bio</h3>
      <p>{bio}</p>
    </div>
  );
}
