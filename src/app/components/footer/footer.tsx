import React from "react";

export default function Footer() {
  return (
    <footer className="border-t bg-white/60 mt-16">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <div className="mb-3 md:mb-0">
          © {new Date().getFullYear()} Bench. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
