import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function AddDeviceForm({ onAdded, onCancel }) {
  const { getAccessTokenSilently } = useAuth0();
  const [name, setName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [customId, setCustomId] = useState("");
  const [mac, setMac] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !mac.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const token = await getAccessTokenSilently();
      const backend_host = import.meta.env.VITE_BACKEND_HOST;
      const res = await fetch(`${backend_host}/device`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim(), macAddress: mac.trim(), ipAddress: ipAddress.trim(), customId: customId.trim() }),
      });
      if (!res.ok) throw new Error(res.statusText || "Failed to add device");
      const addedDevice = await res.json();
      onAdded?.(addedDevice);
      setName("");
      setMac("");
      setIpAddress("");
      setCustomId("");
    } catch (err) {
      setError(err.message || "Error adding device");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2 items-end">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 rounded"
          placeholder="Device name"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">MAC</label>
        <input
          value={mac}
          onChange={(e) => setMac(e.target.value)}
          className="border px-2 py-1 rounded"
          placeholder="AA:BB:CC:DD:EE:FF"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">IP Address</label>
        <input
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          className="border px-2 py-1 rounded"
          placeholder="192.168.86.0"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">Custom ID</label>
        <input
          value={customId}
          onChange={(e) => setCustomId(e.target.value)}
          className="border px-2 py-1 rounded"
          placeholder="custom-id-123"
        />
      </div>

      <button type="submit" disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
        {loading ? "Adding..." : "Add"}
      </button>
      <button type="button" onClick={onCancel} className="px-3 py-1 rounded border">
        Cancel
      </button>

      {error && (
        <div className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}
    </form>
  );
}