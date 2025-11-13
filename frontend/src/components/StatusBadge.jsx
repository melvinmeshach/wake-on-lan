import React from "react";

export default function StatusBadge({ status }) {
  const colors = {
    online: "bg-green-500",
    starting: "bg-yellow-500",
    offline: "bg-gray-400",
  };

  return (
    <span
      className={`text-white text-xs font-medium px-2 py-1 rounded ${colors[status] || "bg-gray-400"}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
