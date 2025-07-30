"use client";

import { createContext, useContext, useState } from "react";

type FontContextType = {
  font: string;
  setFont: (v: string) => void;
};

const FontContext = createContext<FontContextType | undefined>(undefined);

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
};

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFont] = useState("");

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}
