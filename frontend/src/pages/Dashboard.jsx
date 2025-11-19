import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DeviceCard from "../components/DeviceCard";

export default function Dashboard(props) {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const user = props.user;
  
  const [devices, setDevices] = useState([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [error, setError] = useState(null);

  // Added state for "add device" form
  const [isAdding, setIsAdding] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: "", mac: "" });

  // Fetch devices from backend
  useEffect(() => {
    const fetchDevices = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoadingDevices(true);
        setError(null);
        
        const token = await getAccessTokenSilently();
        const backend_host = import.meta.env.VITE_BACKEND_HOST;

        const response = await fetch(`${backend_host}/device`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch devices: ${response.statusText}`);
        }

        const data = await response.json();
        setDevices(data);
      } catch (err) {
        console.error("Error fetching devices:", err);
        setError(err.message);
      } finally {
        setIsLoadingDevices(false);
      }
    };

    fetchDevices();
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleWake = (id) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: "starting" } : d
      )
    );

    setTimeout(() => {
      setDevices((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, status: "online" } : d
        )
      );
    }, 3000);
  };

  // Add device handler
  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!newDevice.name.trim() || !newDevice.mac.trim()) return;

    try {
      const token = await getAccessTokenSilently();
      const backend_host = import.meta.env.VITE_BACKEND_HOST;

      const response = await fetch(`${backend_host}/device`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newDevice.name.trim(),
          macAddress: newDevice.mac.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add device: ${response.statusText}`);
      }

      const addedDevice = await response.json();
      setDevices((prev) => [...prev, addedDevice]);
      setNewDevice({ name: "", mac: "" });
      setIsAdding(false);
    } catch (err) {
      console.error("Error adding device:", err);
      setError(err.message);
    }
  };

  if (isLoading || isLoadingDevices) return <div className="text-center mt-10">Loading...</div>;

  return isAuthenticated ? (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Your Devices</h2>
        <button
          onClick={() => setIsAdding(v => !v)}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          {isAdding ? "Close" : "Add Device"}
        </button>
      </div>

      {!isLoading && user ? (
        <p className="text-gray-600 mb-6">Welcome, {user.name || user.email}!</p>
      ) : <p className="text-gray-600 mb-6">Loading User!</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add device form */}
      {isAdding && (
        <form onSubmit={handleAddDevice} className="mb-4 flex gap-2 items-end">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Name</label>
            <input
              value={newDevice.name}
              onChange={(e) => setNewDevice(n => ({ ...n, name: e.target.value }))}
              className="border px-2 py-1 rounded"
              placeholder="Device name"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">MAC</label>
            <input
              value={newDevice.mac}
              onChange={(e) => setNewDevice(n => ({ ...n, mac: e.target.value }))}
              className="border px-2 py-1 rounded"
              placeholder="AA:BB:CC:DD:EE:FF"
              required
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
            Add
          </button>
          <button type="button" onClick={() => { setIsAdding(false); setNewDevice({ name: "", mac: "" }); }} className="px-3 py-1 rounded border">
            Cancel
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {devices.length > 0 ? (
          devices.map((device) => (
            <DeviceCard key={device.deviceId} device={device} onWake={handleWake} />
          ))
        ) : (
          <p className="text-gray-500">No devices found. Add one to get started!</p>
        )}
      </div>
    </div>
  ) : (
    <div className="text-center mt-10">Please log in to view your dashboard.</div>
  );
}