import React, { useState } from "react";
import DeviceCard from "../components/DeviceCard";

export default function Dashboard() {
  const [devices, setDevices] = useState([
    { id: 1, name: "Home Server", mac: "00:11:22:33:44:55", status: "offline" },
    { id: 2, name: "NAS", mac: "AA:BB:CC:DD:EE:FF", status: "online" },
    { id: 3, name: "Gaming PC", mac: "FF:EE:DD:CC:BB:AA", status: "starting" },
  ]);

  const handleWake = (id) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: "starting" } : d
      )
    );

    // Simulate wake delay
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, status: "online" } : d
        )
      );
    }, 3000);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Devices</h2>
      <div className="grid gap-4">
        {devices.map((device) => (
          <DeviceCard key={device.id} device={device} onWake={handleWake} />
        ))}
      </div>
    </div>
  );
}
