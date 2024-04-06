"use client";
import { useEffect, useState } from "react";
import AuthCheck from "../components/CustomComponents/AuthCheck";
import UserCard from "../components/CustomComponents/UserCard";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);
  return (
    <AuthCheck>
      <div className="flex m-3">
        {users.map(
          (user: {
            id: string;
            name: string;
            age: number | null;
            image: string | null;
            bio: string | null;
          }) => {
            return <UserCard key={user.id} {...user} />;
          }
        )}
      </div>
    </AuthCheck>
  );
}
