import React, {useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Profile(props) {
  const { isAuthenticated, isLoading } = useAuth0();
  const user = props.user;

  if(isLoading) return <div className="text-center mt-10">Loading...</div>;
  else if (!isAuthenticated) return <p>Please log in to view your profile.</p>;
  else if (!user) return <p className="text-center text-gray-600">Loading user...</p>;
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <img referrerPolicy="no-referrer" src={user.picture} alt={user.name} className="w-24 h-24 rounded-full mx-auto" />
      <h2 className="text-center text-2xl font-semibold mt-4">{user.name}</h2>
      <p className="text-center text-gray-600">{user.email}</p>
    </div>
  );
}
