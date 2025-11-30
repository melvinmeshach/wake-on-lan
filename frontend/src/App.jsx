import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { useAuth0 } from "@auth0/auth0-react";

export default function App(props) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);

    // Fetch user profile from backend
    useEffect(() => {
      const fetchUserProfile = async () => {
        if (!isAuthenticated) return;
  
        try {
          const backend_host = import.meta.env.VITE_BACKEND_HOST;
          console.log("backend_host: ", backend_host)
          const token = await getAccessTokenSilently();
          const response = await fetch(`${backend_host}/user`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
  
          if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.statusText}`);
          }
  
          const user = await response.json();
          setUserData(user);
          console.log("User profile:", user);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
  
      fetchUserProfile();
    }, [isAuthenticated, getAccessTokenSilently]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={userData}/>
      <div className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<Home user={userData}/>} />
          <Route path="/dashboard" element={<Dashboard  user={userData}/>} />
          <Route path="/profile" element={<Profile  user={userData}/>} />
        </Routes>
      </div>
    </div>
  );
}
