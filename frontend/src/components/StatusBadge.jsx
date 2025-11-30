import React from "react";

export default function StatusBadge({ status }) {
  const colors = {
    STARTING: "bg-yellow-500",
    MAGIC_PACKET_SENT: "bg-yellow-500",
    ERROR: "bg-red-500",
    CHECKING: "bg-yellow-500",
    ONLINE: "bg-green-500",
    OFFLINE: "bg-orange-500",
    UNKNOWN: "bg-purple-500",
  };
  return (
    <span
      className={`text-white text-xs font-medium px-2 py-1 rounded ${colors[status] || "bg-gray-400"}`}
    >
      {status ? status.toUpperCase():""}
    </span>
  );
}
