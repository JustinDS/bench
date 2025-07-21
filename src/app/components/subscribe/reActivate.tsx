"use client";

export default function reActivateSubscribe() {
  const handleReActivateSubscribe = async () => {
    const res = await fetch("/api/paystack/reActivate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to re-activate subscription");
    }
  };

  return (
    <button
      onClick={handleReActivateSubscribe}
      className="p-4 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
    >
      Re-activate Premium
    </button>
  );
}
