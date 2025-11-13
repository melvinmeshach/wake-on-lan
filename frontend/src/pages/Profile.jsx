import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return <p>Please log in to view your profile.</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full mx-auto" />
      <h2 className="text-center text-2xl font-semibold mt-4">{user.name}</h2>
      <p className="text-center text-gray-600">{user.email}</p>
    </div>
  );
}
