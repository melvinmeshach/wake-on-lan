import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar(props) {
  const { isAuthenticated, loginWithRedirect, isLoading, logout } = useAuth0();
  const user = props.user;

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold">WakeOnLAN</Link>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            {user? <Link to="/profile" className="hover:underline">{user.name}</Link>: null}
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          >
            Login / Signup
          </button>
        )}
      </div>
    </nav>
  );
}
