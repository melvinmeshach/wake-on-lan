import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DeviceCard from "../components/DeviceCard";
import AddDeviceForm from "../components/AddDeviceForm";
import { SocketConnection } from "../utils/socket";

export default function Dashboard(props) {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const user = props.user;
  const socketConnection = new SocketConnection();
  const socket = socketConnection.socket;
  if(socket)
    socket.on("status", (data) => {
      console.log("Status update received:", data);
      const { deviceId, status } = data;
      if (deviceId && status) {
        setStatuses((prevStatuses) => ({
          ...prevStatuses,
          [deviceId]: status,
        }));
      }
    });
  
  const [devices, setDevices] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [error, setError] = useState(null);

  const [isAdding, setIsAdding] = useState(false);
  
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
        const statusMap = {};
        data.forEach((device) => {
          statusMap[device.deviceId] = "CHECKING";
        });
        setStatuses(statusMap);
        data.forEach((device) => subscribeToDeviceUpdates(device));
      } catch (err) {
        console.error("Error fetching devices:", err);
        setError(err.message);
      } finally {
        setIsLoadingDevices(false);
      }
    };

    fetchDevices();
  }, [isAuthenticated, getAccessTokenSilently]);

  const subscribeToDeviceUpdates = (device) => {
    socket.emit("subscribe", device.macAddress+device.ipAddress);
  }
  const handleWake = async (id) => {
    // find device by either deviceId or id (handles backend/frontend shape differences)
    const device = devices.find((d) => (d.deviceId || d.id) === id);
    if (!device) {
      setError("Device not found");
      return;
    }

    const macAddress = device.macAddress ?? null;
    const ipAddress = device.ipAddress ?? null;
    const deviceId = device.deviceId ?? null;

    if (!macAddress) {
      setError("Device missing MAC address");
      return;
    }
    if(!deviceId){
      setError("Device missing Device ID");
      return;
    }

    // optimistic UI update
    setDevices((prev) =>
      prev.map((d) =>
        (d.deviceId || d.id) === id ? { ...d, status: "starting" } : d
      )
    );

    // // keep the visual "starting" -> "online" transition
    // const setOnlineTimeout = setTimeout(() => {
    //   setDevices((prev) =>
    //     prev.map((d) =>
    //       (d.deviceId || d.id) === id ? { ...d, status: "online" } : d
    //     )
    //   );
    // }, 3000);

    try {
      const token = await getAccessTokenSilently();
      const backend_host = import.meta.env.VITE_BACKEND_HOST;

      const resp = await fetch(`${backend_host}/wol-connection/wake`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ macAddress, ipAddress, deviceId }),
      });

      if (!resp.ok) {
        throw new Error(`Failed to wake device: ${resp.statusText}`);
      }

      // optionally inspect response
      const result = await resp.json();
      console.log("Wake response:", result);
    } catch (err) {
      console.error("Error waking device:", err);
      setError(err.message || "Failed to wake device");

      // revert optimistic status on failure
      setDevices((prev) =>
        prev.map((d) =>
          (d.deviceId || d.id) === id ? { ...d, status: "offline" } : d
        )
      );
      clearTimeout(setOnlineTimeout);
    }
  };
  const handleDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      const backend_host = import.meta.env.VITE_BACKEND_HOST;
      const response = await fetch(`${backend_host}/device/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete device: ${response.statusText}`);
      }
      setDevices((prev) => prev.filter((d) => (d.deviceId || d.id) !== id));
    } catch (err) {
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

      {isAdding && (
        <AddDeviceForm
          onAdded={(addedDevice) => {
            setDevices((prev) => [...prev, addedDevice]);
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <div className="grid gap-4">
        {devices.length > 0 ? (
          devices.map((device) => (
            <DeviceCard key={device.deviceId || device.id} device={device} status={statuses[device.deviceId]} onWake={handleWake} onDelete={handleDelete}/>
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