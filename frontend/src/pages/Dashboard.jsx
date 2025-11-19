// ...existing code...
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DeviceCard from "../components/DeviceCard";

export default function Dashboard(props) {
  const { isAuthenticated, isLoading } = useAuth0();
  const user = props.user;
  
  const [devices, setDevices] = useState([
    { id: 1, name: "Home Server", mac: "00:11:22:33:44:55", status: "offline" },
    { id: 2, name: "NAS", mac: "AA:BB:CC:DD:EE:FF", status: "online" },
    { id: 3, name: "Gaming PC", mac: "FF:EE:DD:CC:BB:AA", status: "starting" },
  ]);

  // Added state for "add device" form
  const [isAdding, setIsAdding] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: "", mac: "" });

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
  const handleAddDevice = (e) => {
    e.preventDefault();
    if (!newDevice.name.trim() || !newDevice.mac.trim()) return;
    const nextId = devices.length ? Math.max(...devices.map(d => d.id)) + 1 : 1;
    setDevices(prev => [
      ...prev,
      { id: nextId, name: newDevice.name.trim(), mac: newDevice.mac.trim(), status: "offline" }
    ]);
    setNewDevice({ name: "", mac: "" });
    setIsAdding(false);
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

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
        {devices.map((device) => (
          <DeviceCard key={device.id} device={device} onWake={handleWake} />
        ))}
      </div>
    </div>
  ) : (
    <div className="text-center mt-10">Please log in to view your dashboard.</div>
  );
}
// ...existing code...