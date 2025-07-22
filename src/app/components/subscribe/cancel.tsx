"use client";

import { getURL } from "@/utils/functions/urlHelper";

export default function cancelSubscribe() {
  const handleCancelSubscribe = async () => {
    const res = await fetch("/api/paystack/cancelSubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    console.log("cancel data", data);
    if (data) {
      window.location.href = `${getURL()}/dashboard`;
    } else {
      alert("Failed to cancel subscription");
    }
  };

  return (
    <button
      onClick={handleCancelSubscribe}
      className="p-4 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
    >
      Cancel Premium
    </button>
  );
}
