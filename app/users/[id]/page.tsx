import AuthCheck from "@/app/components/CustomComponents/AuthCheck";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  return { title: `User profile of ${user?.name}` };
}

export default async function UserProfile(props: Props) {
  const params = await props.params;
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  const { name, bio, image, id } = user ?? {};

  return (
    <AuthCheck>
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
    </AuthCheck>
  );
}
