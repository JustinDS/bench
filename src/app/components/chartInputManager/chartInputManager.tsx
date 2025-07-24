"use client";

import React, { useEffect, useState } from "react";
import { BarChart } from "../chart/bar/barChart";
import { Plus, X } from "lucide-react";
import { LabeledSlider } from "../slider/slider";

export type Entry = {
  label: string;
  labelFontSize: number;
  value: number;
  valueFontSize: number;
  valuePositionX?: number;
  valuePositionY?: number;
  sublabel?: string;
  labelPositionX?: number;
  labelPositionY?: number;
  sublabelFontSize?: number;
  sublabelPositionX?: number;
  sublabelPositionY?: number;
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
      labelFontSize: 16,
      valueFontSize: 16,
      value: 100,
      bgColor: "#808080",
      fgColor: "#4a8050",
      labelColour: "#000000",
      sublabelColour: "#000000",
      valueColour: "#000000",
    },
  ]);
  const [showLabelInside, setShowLabelInside] = useState(true);
  const [chartWidth, setChartWidth] = useState(600);
  const [barHeight, setBarHeight] = useState(60);
  const [barSpacing, setBarSpacing] = useState(15);
  const [labelFontSize, setLabelFontSize] = useState(16);
  const [sublabelFontSize, setSublabelFontSize] = useState(14);
  const [sublabelPositionX, setSublabelPositionX] = useState(10);
  const [sublabelPositionY, setSublabelPositionY] = useState(12);
  const [labelPositionX, setLabelPositionX] = useState(10);
  const [labelPositionY, setLabelPositionY] = useState(5);
  const [valuePositionX, setValuePositionX] = useState(-30);
  const [valuePositionY, setValuePositionY] = useState(5);
  const [valueFontSize, setValueFontSize] = useState(-30);
  const [showindexSettings, setShowindexSettings] = useState(0);

  const handleShowSettings = (index: number) => {
    setShowindexSettings(index);
  };

  useEffect(() => {
    setLabelFontSize(entries[showindexSettings].labelFontSize);
    setSublabelFontSize(entries[showindexSettings]?.sublabelFontSize ?? 14);
    setSublabelPositionX(entries[showindexSettings]?.sublabelPositionX ?? 10);
    setSublabelPositionY(entries[showindexSettings]?.sublabelPositionY ?? 12);
    setLabelPositionX(entries[showindexSettings]?.labelPositionX ?? 10);
    setLabelPositionY(entries[showindexSettings]?.labelPositionY ?? 5);
    setValuePositionX(entries[showindexSettings]?.valuePositionX ?? -30);
    setValuePositionY(entries[showindexSettings].valuePositionY ?? 5);
    setValueFontSize(entries[showindexSettings].valueFontSize);
  }, [showindexSettings]);

  const handleChange = (
    index: number,
    key: keyof Entry,
    val: string | number
  ) => {
    debugger;
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      [key]: key === "value" ? Number(val) : val,
    };
    setEntries(newEntries);
  };

  const addEntry = () => {
    console.log("entries.length", entries.length);
    setEntries([
      ...entries,
      {
        label: "",
        value: 0,
        labelFontSize: entries[entries.length - 1].labelFontSize,
        valueFontSize: entries[entries.length - 1].valueFontSize,
        sublabelFontSize: entries[entries.length - 1].sublabelFontSize,
        labelPositionX: entries[entries.length - 1].labelPositionX,
        labelPositionY: entries[entries.length - 1].labelPositionY,
        sublabelPositionX: entries[entries.length - 1].sublabelPositionX,
        sublabelPositionY: entries[entries.length - 1].sublabelPositionY,
        valuePositionX: entries[entries.length - 1].valuePositionX,
        valuePositionY: entries[entries.length - 1].valuePositionY,
      },
    ]);

    setShowindexSettings(entries.length);
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
          showindexSettings={handleShowSettings}
        />
      </div>

      <div className="flex flex-col gap-4 max-w-7xl mx-auto">
        {/* Input Fields */}
        {/* <div className="flex flex-col gap-2">
          {entries.map((entry, i) => (
            <div
              key={i}
              className="border border-gray-300 p-4 rounded-2xl hover:border-gray-400 transition-all ease-in-out duration-300 bg-gray-200"
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
                <div className="border-b pb-6">
                  <input
                    type="text"
                    value={entry.label}
                    onChange={(e) => handleChange(i, "label", e.target.value)}
                    placeholder="Label"
                    className="border rounded px-2 py-1 flex-1 min-w-[150px]"
                  />
                  <input
                    type="color"
                    value={entry.labelColour || "#000000"}
                    onChange={(e) =>
                      handleChange(i, "labelColour", e.target.value)
                    }
                    className="ml-2"
                  />
                  <LabeledSlider
                    label="Font Size"
                    value={labelFontSize}
                    onChange={(val) => {
                      handleChange(i, "labelFontSize", val);
                      setLabelFontSize(val);
                    }}
                  />
                  <LabeledSlider
                    label="Label Position X"
                    value={labelPositionX}
                    onChange={(val) => {
                      handleChange(i, "labelPositionX", val);
                      setLabelPositionX(val);
                    }}
                  />
                  <LabeledSlider
                    label="Label Position Y"
                    value={labelPositionY}
                    onChange={(val) => {
                      handleChange(i, "labelPositionY", val);
                      setLabelPositionY(val);
                    }}
                  />
                </div>

                <div className="border-b pb-6 pt-6">
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
                    value={entry.sublabelColour || "#000000"}
                    onChange={(e) =>
                      handleChange(i, "sublabelColour", e.target.value)
                    }
                    className="ml-2"
                  />
                  <LabeledSlider
                    label="Font Size"
                    value={sublabelFontSize}
                    onChange={(val) => {
                      handleChange(i, "sublabelFontSize", val);
                      setSublabelFontSize(val);
                    }}
                  />
                  <LabeledSlider
                    label="Sublabel Position X"
                    value={sublabelPositionX}
                    onChange={(val) => {
                      handleChange(i, "sublabelPositionX", val);
                      setSublabelPositionX(val);
                    }}
                  />
                  <LabeledSlider
                    label="Sublabel Position Y"
                    value={sublabelPositionY}
                    onChange={(val) => {
                      handleChange(i, "sublabelPositionY", val);
                      setSublabelPositionY(val);
                    }}
                  />
                </div>

                <div className="border-b pb-6 pt-6">
                  <input
                    type="number"
                    value={entry.value}
                    onChange={(e) => handleChange(i, "value", e.target.value)}
                    placeholder="Value"
                    className="border rounded px-2 py-1 w-24"
                  />
                  <input
                    type="color"
                    value={entry.valueColour || "#000000"}
                    onChange={(e) =>
                      handleChange(i, "valueColour", e.target.value)
                    }
                    className="ml-2"
                  />
                  <LabeledSlider
                    label="Font Size"
                    value={valueFontSize}
                    onChange={(val) => {
                      handleChange(i, "valueFontSize", val);
                      setValueFontSize(val);
                    }}
                  />
                  <LabeledSlider
                    label="Value Position X"
                    value={valuePositionX}
                    onChange={(val) => {
                      handleChange(i, "valuePositionX", val);
                      setValuePositionX(val);
                    }}
                    initialMin={-100}
                    initialMax={0}
                  />
                  <LabeledSlider
                    label="Value Position Y"
                    value={valuePositionY}
                    onChange={(val) => {
                      handleChange(i, "valuePositionY", val);
                      setValuePositionY(val);
                    }}
                  />
                </div>
              </div>
              <div className="pb-6 pt-6">
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
        </div> */}

        <div className="flex flex-col gap-2">
          <div className="border border-gray-300 p-4 rounded-2xl hover:border-gray-400 transition-all ease-in-out duration-300 bg-gray-200">
            <div className="flex">
              <button
                type="button"
                onClick={() => handleDelete(showindexSettings)}
                className="cursor-pointer ml-auto pb-4"
              >
                <X className="stroke-gray-500 hover:stroke-gray-800 transition-all ease-in-out duration-300" />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap flex-col">
              <div className="border-b pb-6">
                <input
                  type="text"
                  value={entries[showindexSettings].label}
                  onChange={(e) =>
                    handleChange(showindexSettings, "label", e.target.value)
                  }
                  placeholder="Label"
                  className="border rounded px-2 py-1 flex-1 min-w-[150px]"
                />
                <input
                  type="color"
                  value={entries[showindexSettings].labelColour || "#000000"}
                  onChange={(e) =>
                    handleChange(
                      showindexSettings,
                      "labelColour",
                      e.target.value
                    )
                  }
                  className="ml-2"
                />
                <LabeledSlider
                  label="Font Size"
                  value={labelFontSize}
                  onChange={(val) => {
                    handleChange(showindexSettings, "labelFontSize", val);
                    setLabelFontSize(val);
                  }}
                />
                <LabeledSlider
                  label="Label Position X"
                  value={labelPositionX}
                  onChange={(val) => {
                    handleChange(showindexSettings, "labelPositionX", val);
                    setLabelPositionX(val);
                  }}
                />
                <LabeledSlider
                  label="Label Position Y"
                  value={labelPositionY}
                  onChange={(val) => {
                    handleChange(showindexSettings, "labelPositionY", val);
                    setLabelPositionY(val);
                  }}
                />
              </div>

              <div className="border-b pb-6 pt-6">
                <input
                  type="text"
                  value={entries[showindexSettings].sublabel ?? ""}
                  onChange={(e) =>
                    handleChange(showindexSettings, "sublabel", e.target.value)
                  }
                  placeholder="Sublabel"
                  className="border rounded px-2 py-1 flex-1 min-w-[150px]"
                />
                <input
                  type="color"
                  value={entries[showindexSettings].sublabelColour || "#000000"}
                  onChange={(e) =>
                    handleChange(
                      showindexSettings,
                      "sublabelColour",
                      e.target.value
                    )
                  }
                  className="ml-2"
                />
                <LabeledSlider
                  label="Font Size"
                  value={sublabelFontSize}
                  onChange={(val) => {
                    handleChange(showindexSettings, "sublabelFontSize", val);
                    setSublabelFontSize(val);
                  }}
                />
                <LabeledSlider
                  label="Sublabel Position X"
                  value={sublabelPositionX}
                  onChange={(val) => {
                    handleChange(showindexSettings, "sublabelPositionX", val);
                    setSublabelPositionX(val);
                  }}
                />
                <LabeledSlider
                  label="Sublabel Position Y"
                  value={sublabelPositionY}
                  onChange={(val) => {
                    handleChange(showindexSettings, "sublabelPositionY", val);
                    setSublabelPositionY(val);
                  }}
                />
              </div>

              <div className="border-b pb-6 pt-6">
                <input
                  type="number"
                  value={entries[showindexSettings].value}
                  onChange={(e) =>
                    handleChange(showindexSettings, "value", e.target.value)
                  }
                  placeholder="Value"
                  className="border rounded px-2 py-1 w-24"
                />
                <input
                  type="color"
                  value={entries[showindexSettings].valueColour || "#000000"}
                  onChange={(e) =>
                    handleChange(
                      showindexSettings,
                      "valueColour",
                      e.target.value
                    )
                  }
                  className="ml-2"
                />
                <LabeledSlider
                  label="Font Size"
                  value={valueFontSize}
                  onChange={(val) => {
                    handleChange(showindexSettings, "valueFontSize", val);
                    setValueFontSize(val);
                  }}
                />
                <LabeledSlider
                  label="Value Position X"
                  value={valuePositionX}
                  onChange={(val) => {
                    handleChange(showindexSettings, "valuePositionX", val);
                    setValuePositionX(val);
                  }}
                  initialMin={-100}
                  initialMax={0}
                />
                <LabeledSlider
                  label="Value Position Y"
                  value={valuePositionY}
                  onChange={(val) => {
                    handleChange(showindexSettings, "valuePositionY", val);
                    setValuePositionY(val);
                  }}
                />
              </div>
            </div>
            <div className="pb-6 pt-6">
              <label>
                Foreground Color:
                <input
                  type="color"
                  value={entries[showindexSettings].fgColor || "#4f46e5"}
                  onChange={(e) =>
                    handleChange(showindexSettings, "fgColor", e.target.value)
                  }
                  className="ml-2"
                />
              </label>

              <label>
                Background Color:
                <input
                  type="color"
                  value={entries[showindexSettings].bgColor || "#c7d2fe"}
                  onChange={(e) =>
                    handleChange(showindexSettings, "bgColor", e.target.value)
                  }
                  className="ml-2"
                />
              </label>
            </div>
          </div>
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
