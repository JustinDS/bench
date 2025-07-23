"use client";

import React, { useState } from "react";
import { BarChart } from "../chart/bar/barChart";

export type Entry = {
  label: string;
  value: number;
  sublabel?: string;
};

export const ChartInputManager = () => {
  const [entries, setEntries] = useState<Entry[]>([
    { label: "This machine", value: 22 },
  ]);
  const [showLabelInside, setShowLabelInside] = useState(false);
  const [chartWidth, setChartWidth] = useState(600);
  const [barHeight, setBarHeight] = useState(30);
  const [barSpacing, setBarSpacing] = useState(15);

  const handleChange = (index: number, key: keyof Entry, val: string) => {
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      [key]: key === "value" ? Number(val) : val,
    };
    setEntries(newEntries);
  };

  const addEntry = () => {
    setEntries([...entries, { label: "", value: 0 }]);
  };

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      {/* Input Fields */}
      <div className="flex flex-col gap-2">
        {entries.map((entry, i) => (
          <div key={i} className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={entry.label}
              onChange={(e) => handleChange(i, "label", e.target.value)}
              placeholder="Label"
              className="border rounded px-2 py-1 flex-1 min-w-[150px]"
            />
            <input
              type="text"
              value={entry.sublabel ?? ""}
              onChange={(e) => handleChange(i, "sublabel", e.target.value)}
              placeholder="Sublabel"
              className="border rounded px-2 py-1 flex-1 min-w-[150px]"
            />
            <input
              type="number"
              value={entry.value}
              onChange={(e) => handleChange(i, "value", e.target.value)}
              placeholder="Value"
              className="border rounded px-2 py-1 w-24"
            />
          </div>
        ))}
        <button
          onClick={addEntry}
          className="bg-blue-600 text-white px-3 py-1 rounded w-fit mt-2"
        >
          + Add Row
        </button>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="chart-width" className="w-24">
            Chart width
          </label>
          <input
            id="chart-width"
            type="number"
            value={chartWidth}
            onChange={(e) => setChartWidth(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="bar-height" className="w-24">
            Bar height
          </label>
          <input
            id="bar-height"
            type="number"
            value={barHeight}
            onChange={(e) => setBarHeight(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="bar-spacing" className="w-24">
            Bar spacing
          </label>
          <input
            id="bar-spacing"
            type="number"
            value={barSpacing}
            onChange={(e) => setBarSpacing(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show-label-inside"
            checked={showLabelInside}
            onChange={(e) => setShowLabelInside(e.target.checked)}
          />
          <label htmlFor="show-label-inside" className="text-sm text-gray-700">
            Show label inside bar
          </label>
        </div>
      </div>

      {/* Chart */}
      <BarChart
        data={entries}
        showLabelInside={showLabelInside}
        chartWidth={chartWidth}
        barHeight={barHeight}
        barSpacing={barSpacing}
      />
    </div>
  );
};
