"use client";
interface PremiumProps {
  userId: string;
  email?: string;
}

export default function Premium({ userId, email }: PremiumProps) {
  const handleSubscribe = async () => {
    const res = await fetch("/api/paystack/subscribe", {
      method: "POST",
      body: JSON.stringify({
        email: email, // the logged-in user's email
        userId: userId, // your user ID
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to start subscription");
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      className="p-4 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
    >
      Sign up for premium
    </button>
  );
}
