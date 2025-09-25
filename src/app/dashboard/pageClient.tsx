"use client";

import { createContext, useContext, useState } from "react";
import { ChartInputManager } from "../components/chartInputManager/chartInputManager";
import FontPicker, {
  FontPickerProps,
} from "../components/fontPicker/fontPicker";
import { FontSelection, WebFont } from "./page";
import { FontProvider } from "../contexts/fontContext";
import { GroupedBarChart } from "../components/chart/bar/groupedBarChart";

export interface DashboardProps {
  font: FontSelection;
}

export default function ClientDashboard({ font }: DashboardProps) {
  return (
    <FontProvider>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* <FontPicker fonts={fonts} selectedFont={selectedFont} /> */}
        {/* <ChartInputManager /> */}

        <div className="pt-10">
          <GroupedBarChart font={font} />
        </div>
      </div>
    </FontProvider>
  );
}
