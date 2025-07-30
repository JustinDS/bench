"use client";

import { createContext, useContext, useState } from "react";
import { ChartInputManager } from "../components/chartInputManager/chartInputManager";
import FontPicker, {
  FontPickerProps,
} from "../components/fontPicker/fontPicker";
import { WebFont } from "./page";
import { FontProvider } from "../contexts/fontContext";

export interface ClientDashboardProps {
  fonts: WebFont[];
  selectedFont: string;
}

export default function ClientDashboard({
  fonts,
  selectedFont,
}: ClientDashboardProps) {
  return (
    <FontProvider>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <FontPicker fonts={fonts} selectedFont={selectedFont} />
        <ChartInputManager />
      </div>
    </FontProvider>
  );
}
