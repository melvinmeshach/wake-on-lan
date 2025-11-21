import React from "react";
import StatusBadge from "./StatusBadge";

export default function DeviceCard({ device, onWake, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">{device.name}</h3>
        <p className="text-gray-500 text-sm">{device.mac}</p>
        {device.ipAddress && (
          <p className="text-gray-500 text-sm">IP: {device.ipAddress}</p>
        )}
        {device.customId && (
          <p className="text-gray-500 text-sm">Custom ID: {device.customId}</p>
        )}
        <StatusBadge status={device.status|| "unknown"} />
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          onClick={() => {console.log("wake", device.deviceId); onWake(device.deviceId)}}
        >
          Wake
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          onClick={() => onDelete(device.deviceId)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
