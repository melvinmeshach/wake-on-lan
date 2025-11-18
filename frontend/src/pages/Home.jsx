import React, {useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export default function Home(props) {
  const [userData, setUserData] = useState(null);
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  useEffect(() => {
    if(isAuthenticated)
      setUserData(props.user);
  }, [props.user]);

  if (isLoading) {
      return <div className="text-center mt-10">Loading...</div>;
    }

  return (
    <div className="flex flex-col items-center justify-center text-center h-[70vh]">
      <h1 className="text-4xl font-bold mb-4">Wake-on-LAN Dashboard</h1>
      {userData ? <p className="text-gray-600 mb-6">Hi, {userData.name}</p> : null}
      <p className="text-gray-600 mb-6">Remotely power on and manage your devices.</p>

      {isAuthenticated ? (
        <Link
          to="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Go to Dashboard
        </Link>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Login
        </button>
      )}
    </div>
  );
}
