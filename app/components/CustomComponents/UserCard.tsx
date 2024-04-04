import Link from "next/link";
import Image from "next/image";

interface Props {
  id: string;
  name: string | null;
  age: number | null;
  image: string | null;
}

export default function UserCard({ id, name, age, image }: Props) {
  return (
    <div className="card items-center shadow-xl">
      <div className="px-3 pt-3 avatar">
        <div className="w-24 mask mask-squircle">
          <Image
            src={image ?? "/peeps.svg"}
            alt={`${name}'s profile`}
            width={128}
            height={128}
          />
        </div>
      </div>
      <div className="card-body items-center text-center">
        <h3 className="card-title">
          <Link href={`/users/${id}`}>{name}</Link>
        </h3>
      </div>
    </div>
  );
}
