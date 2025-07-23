"use client";

import React, { useState } from "react";
import { BarChart } from "../chart/bar/barChart";
import { Plus, X } from "lucide-react";

export type Entry = {
  label: string;
  value: number;
  sublabel?: string;
  fgColor?: string;
  bgColor?: string;
  labelColour?: string;
  sublabelColour?: string;
  valueColour?: string;
};

export const ChartInputManager = () => {
  const [entries, setEntries] = useState<Entry[]>([
    {
      label: "This machine",
      value: 22,
      bgColor: "#808080",
      fgColor: "#4a8050",
      labelColour: "#000000",
      sublabelColour: "#000000",
      valueColour: "#000000",
    },
  ]);
  const [showLabelInside, setShowLabelInside] = useState(true);
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

  const handleDelete = (index: number) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  return (
    <div>
      <div className="justify-items-center">
        {/* Chart */}
        <BarChart
          data={entries}
          showLabelInside={showLabelInside}
          chartWidth={chartWidth}
          barHeight={barHeight}
          barSpacing={barSpacing}
        />
      </div>

      <div className="flex flex-col gap-4 max-w-7xl mx-auto">
        {/* Input Fields */}
        <div className="flex flex-col gap-2">
          {entries.map((entry, i) => (
            <div
              key={i}
              className="border border-gray-300 p-4 rounded-2xl hover:border-gray-400 transition-all ease-in-out duration-300"
            >
              <div className="flex">
                <button
                  type="button"
                  onClick={() => handleDelete(i)}
                  className="cursor-pointer ml-auto pb-4"
                >
                  <X className="stroke-gray-500 hover:stroke-gray-800 transition-all ease-in-out duration-300" />
                </button>
              </div>
              <div className="flex gap-2 flex-wrap flex-col">
                <div>
                  <input
                    type="text"
                    value={entry.label}
                    onChange={(e) => handleChange(i, "label", e.target.value)}
                    placeholder="Label"
                    className="border rounded px-2 py-1 flex-1 min-w-[150px]"
                  />
                  <input
                    type="color"
                    value={entry.labelColour || "#ffffff"}
                    onChange={(e) =>
                      handleChange(i, "labelColour", e.target.value)
                    }
                    className="ml-2"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={entry.sublabel ?? ""}
                    onChange={(e) =>
                      handleChange(i, "sublabel", e.target.value)
                    }
                    placeholder="Sublabel"
                    className="border rounded px-2 py-1 flex-1 min-w-[150px]"
                  />
                  <input
                    type="color"
                    value={entry.sublabelColour || "#ffffff"}
                    onChange={(e) =>
                      handleChange(i, "sublabelColour", e.target.value)
                    }
                    className="ml-2"
                  />
                </div>

                <div>
                  <input
                    type="number"
                    value={entry.value}
                    onChange={(e) => handleChange(i, "value", e.target.value)}
                    placeholder="Value"
                    className="border rounded px-2 py-1 w-24"
                  />
                  <input
                    type="color"
                    value={entry.valueColour || "#ffffff"}
                    onChange={(e) =>
                      handleChange(i, "valueColour", e.target.value)
                    }
                    className="ml-2"
                  />
                </div>
              </div>
              <div>
                <label>
                  Foreground Color:
                  <input
                    type="color"
                    value={entry.fgColor || "#4f46e5"}
                    onChange={(e) => handleChange(i, "fgColor", e.target.value)}
                    className="ml-2"
                  />
                </label>

                <label>
                  Background Color:
                  <input
                    type="color"
                    value={entry.bgColor || "#c7d2fe"}
                    onChange={(e) => handleChange(i, "bgColor", e.target.value)}
                    className="ml-2"
                  />
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={addEntry}
            className="px-3 py-1 rounded mt-2 flex w-full border border-gray-300 hover:border-gray-500 justify-center cursor-pointer"
          >
            <Plus />
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

          {/* <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-label-inside"
              checked={showLabelInside}
              onChange={(e) => setShowLabelInside(e.target.checked)}
            />
            <label
              htmlFor="show-label-inside"
              className="text-sm text-gray-700"
            >
              Show label inside bar
            </label>
          </div> */}
        </div>
      </div>
    </div>
  );
};
