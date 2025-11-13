import React from "react";
import StatusBadge from "./StatusBadge";

export default function DeviceCard({ device, onWake }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">{device.name}</h3>
        <p className="text-gray-500 text-sm">{device.mac}</p>
        <StatusBadge status={device.status} />
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        onClick={() => onWake(device.id)}
        disabled={device.status === "online"}
      >
        Wake
      </button>
    </div>
  );
}
