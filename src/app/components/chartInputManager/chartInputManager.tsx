"use client";

import React, { useEffect, useState } from "react";
import { BarChart } from "../chart/bar/barChart";
import { Plus, X } from "lucide-react";
import { LabeledSlider } from "../slider/slider";
import { RgbaColor, RgbaColorPicker } from "react-colorful";
import { PopoverPicker } from "../colorPicker/popoverPicker";

export type Entry = {
  label: string;
  // labelFontSize: number;
  value: number;
  // valueFontSize: number;
  // valuePositionX?: number;
  // valuePositionY?: number;
  sublabel?: string;
  // labelPositionX?: number;
  // labelPositionY?: number;
  // sublabelFontSize?: number;
  // sublabelPositionX?: number;
  // sublabelPositionY?: number;
  fgColor?: RgbaColor;
  bgColor?: RgbaColor;
  labelColour?: string;
  sublabelColour?: string;
  valueColour?: string;
};

// export interface ChartInputManagerProps {
// }

export const ChartInputManager = () => {
  const [entries, setEntries] = useState<Entry[]>([
    {
      label: "This machine",
      // labelFontSize: 16,
      // valueFontSize: 16,
      value: 100,
      bgColor: {
        r: 220,
        g: 220,
        b: 220,
        a: 1,
      },
      fgColor: {
        r: 55,
        g: 173,
        b: 73,
        a: 1,
      },
      labelColour: "#000000",
      sublabelColour: "#000000",
      valueColour: "#000000",
    },
  ]);
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
  const [valueFontSize, setValueFontSize] = useState(16);
  const [roundedCorners, setRoundedCorners] = useState(5);
  const [showindexSettings, setShowindexSettings] = useState(0);
  const [chartTitleHeight, setChartTitleHeight] = useState(0);

  const [chartTitle, setChartTitle] = useState("");
  const [chartTitleColour, setChartTitleColour] = useState("#000000");
  const [chartTitleFontSize, setChartTitleFontSize] = useState(16);
  const [chartTitlePositionX, setChartTitlePositionX] = useState(10);
  const [chartTitlePositionY, setChartTitlePositionY] = useState(0);

  const [chartSubTitle, setChartSubTitle] = useState("");
  const [chartSubTitleColour, setChartSubTitleColour] = useState("#000000");
  const [chartSubTitleFontSize, setChartSubTitleFontSize] = useState(14);
  const [chartSubTitlePositionX, setChartSubTitlePositionX] = useState(10);
  const [chartSubTitlePositionY, setChartSubTitlePositionY] = useState(0);

  const [foreGroundColor, setForeGroundColor] = useState({
    r: 55,
    g: 173,
    b: 73,
    a: 1,
  });
  const [backGroundColor, setBackGroundColor] = useState({
    r: 220,
    g: 220,
    b: 220,
    a: 1,
  });

  const handleShowSettings = (index: number) => {
    setShowindexSettings(index);
  };

  useEffect(() => {
    // setLabelFontSize(entries[showindexSettings].labelFontSize);
    // setSublabelFontSize(entries[showindexSettings]?.sublabelFontSize ?? 14);
    // setSublabelPositionX(entries[showindexSettings]?.sublabelPositionX ?? 10);
    // setSublabelPositionY(entries[showindexSettings]?.sublabelPositionY ?? 12);
    // setLabelPositionX(entries[showindexSettings]?.labelPositionX ?? 10);
    // setLabelPositionY(entries[showindexSettings]?.labelPositionY ?? 5);
    // setValuePositionX(entries[showindexSettings]?.valuePositionX ?? -30);
    // setValuePositionY(entries[showindexSettings].valuePositionY ?? 5);
    // setValueFontSize(entries[showindexSettings].valueFontSize);
    setBackGroundColor(
      entries[showindexSettings].bgColor ?? {
        r: 55,
        g: 173,
        b: 73,
        a: 1,
      }
    );
    setForeGroundColor(
      entries[showindexSettings].fgColor ?? {
        r: 55,
        g: 173,
        b: 73,
        a: 1,
      }
    );
  }, [showindexSettings]);

  const handleChange = (
    index: number,
    key: keyof Entry,
    val: string | number | RgbaColor
  ) => {
    const newEntries = [...entries];

    newEntries[index] = {
      ...newEntries[index],
      [key]: val,
    };
    setEntries(newEntries);
  };

  const addEntry = () => {
    console.log("entries.length", entries.length);
    setEntries([
      ...entries,
      {
        label: "",
        value: entries[entries.length - 1].value,
        // labelFontSize: entries[entries.length - 1].labelFontSize,
        // valueFontSize: entries[entries.length - 1].valueFontSize,
        // sublabelFontSize: entries[entries.length - 1].sublabelFontSize,
        // labelPositionX: entries[entries.length - 1].labelPositionX,
        // labelPositionY: entries[entries.length - 1].labelPositionY,
        // sublabelPositionX: entries[entries.length - 1].sublabelPositionX,
        // sublabelPositionY: entries[entries.length - 1].sublabelPositionY,
        // valuePositionX: entries[entries.length - 1].valuePositionX,
        // valuePositionY: entries[entries.length - 1].valuePositionY,
        bgColor: entries[entries.length - 1].bgColor ?? {
          r: 220,
          g: 220,
          b: 220,
          a: 1,
        },
        fgColor: entries[entries.length - 1].fgColor ?? {
          r: 55,
          g: 173,
          b: 73,
          a: 1,
        },
      },
    ]);

    setShowindexSettings(entries.length);
  };

  const handleDelete = (index: number) => {
    if (entries.length !== 1) {
      const newEntries = [...entries];
      newEntries.splice(index, 1);
      setEntries(newEntries);
    }
  };

  return (
    <div>
      {/* Settings */}
      <div className="flex flex-col gap-4 max-w-7xl mx-auto">
        <div className="border border-gray-300 p-4 rounded-2xl hover:border-gray-400 transition-all ease-in-out duration-300 bg-gray-200 mt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <LabeledSlider
                label="Chart Width"
                value={chartWidth}
                onChange={(val) => {
                  setChartWidth(Number(val));
                }}
                initialMax={1920}
                initialMin={200}
              />
            </div>

            <div className="flex items-center gap-2">
              <LabeledSlider
                label="Bar Height"
                value={barHeight}
                onChange={(val) => {
                  setBarHeight(Number(val));
                }}
                initialMax={300}
                initialMin={10}
              />
            </div>

            <div className="flex items-center gap-2">
              <LabeledSlider
                label="Gap Spacing"
                value={barSpacing}
                onChange={(val) => {
                  setBarSpacing(Number(val));
                }}
                initialMax={60}
                initialMin={0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Title section */}
      <div className="flex flex-col gap-4 max-w-7xl mx-auto">
        <div className="border border-gray-300 p-4 rounded-2xl hover:border-gray-400 transition-all ease-in-out duration-300 bg-gray-200 mt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <LabeledSlider
                label="Title Section Height"
                value={chartTitleHeight}
                onChange={(val) => {
                  setChartTitleHeight(Number(val));
                }}
                initialMax={200}
                initialMin={0}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <input
                id="chart-title"
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Title"
                className="border rounded px-2 py-1 flex-1 min-w-[150px]"
              />
              <input
                type="color"
                value={chartTitleColour || "#000000"}
                onChange={(e) => setChartTitleColour(e.target.value)}
                className="ml-2"
              />
              <LabeledSlider
                label="Title Font Size"
                value={chartTitleFontSize}
                onChange={(val) => {
                  setChartTitleFontSize(val);
                }}
              />
              <LabeledSlider
                label="Title Position X"
                value={chartTitlePositionX}
                onChange={(val) => {
                  // handleChange(showindexSettings, "labelPositionX", val);
                  setChartTitlePositionX(val);
                }}
              />
              <LabeledSlider
                label="Title Position Y"
                value={chartTitlePositionY}
                onChange={(val) => {
                  // handleChange(showindexSettings, "labelPositionY", val);
                  setChartTitlePositionY(val);
                }}
              />
            </div>
            <div className="flex flex-col">
              <input
                id="chart-subtitle"
                type="text"
                value={chartSubTitle}
                onChange={(e) => setChartSubTitle(e.target.value)}
                placeholder="Subtitle"
                className="border rounded px-2 py-1 flex-1 min-w-[150px]"
              />
              <input
                type="color"
                value={chartSubTitleColour || "#000000"}
                onChange={(e) => setChartSubTitleColour(e.target.value)}
                className="ml-2"
              />
              <LabeledSlider
                label="Subtitle Font Size"
                value={chartSubTitleFontSize}
                onChange={(val) => {
                  setChartSubTitleFontSize(val);
                }}
              />
              <LabeledSlider
                label="Subtitle Position X"
                value={chartSubTitlePositionX}
                onChange={(val) => {
                  // handleChange(showindexSettings, "labelPositionX", val);
                  setChartSubTitlePositionX(val);
                }}
              />
              <LabeledSlider
                label="Subtitle Position Y"
                value={chartSubTitlePositionY}
                onChange={(val) => {
                  // handleChange(showindexSettings, "labelPositionY", val);
                  setChartSubTitlePositionY(val);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="justify-items-center">
        {/* Chart */}
        <BarChart
          data={entries}
          chartWidth={chartWidth}
          barHeight={barHeight}
          barSpacing={barSpacing}
          labelFontSize={labelFontSize}
          valueFontSize={valueFontSize}
          labelPositionX={labelPositionX}
          labelPositionY={labelPositionY}
          sublabelFontSize={sublabelFontSize}
          sublabelPositionX={sublabelPositionX}
          sublabelPositionY={sublabelPositionY}
          valuePositionX={valuePositionX}
          valuePositionY={valuePositionY}
          roundedCorners={roundedCorners}
          chartTitleHeight={chartTitleHeight}
          chartTitle={chartTitle}
          chartTitleColour={chartTitleColour}
          chartTitleFontSize={chartTitleFontSize}
          chartTitlePositionX={chartTitlePositionX}
          chartTitlePositionY={chartTitlePositionY}
          chartSubTitle={chartSubTitle}
          chartSubTitleColour={chartSubTitleColour}
          chartSubTitleFontSize={chartSubTitleFontSize}
          chartSubTitlePositionX={chartSubTitlePositionX}
          chartSubTitlePositionY={chartSubTitlePositionY}
          showindexSettings={handleShowSettings}
        />
      </div>

      <div className="flex flex-col gap-4 max-w-7xl mx-auto">
        <button
          onClick={addEntry}
          className="px-3 py-1 rounded mt-2 flex w-full border border-gray-300 hover:border-gray-500 justify-center cursor-pointer"
        >
          <Plus />
        </button>

        {/* Input Fields */}
        {entries[showindexSettings] ? (
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-gray-500 border-b pb-6 pt-6 md:pt-0 md:pb-0 md:border-b-0 md:border-r md:pr-3">
                  <input
                    id="label"
                    type="text"
                    value={entries[showindexSettings]?.label}
                    onChange={(e) =>
                      handleChange(showindexSettings, "label", e.target.value)
                    }
                    placeholder="Label"
                    className="border rounded px-2 py-1 flex-1 min-w-[150px]"
                  />
                  <input
                    type="color"
                    value={entries[showindexSettings]?.labelColour || "#000000"}
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
                      // handleChange(showindexSettings, "labelFontSize", val);
                      setLabelFontSize(val);
                    }}
                  />
                  <LabeledSlider
                    label="Label Position X"
                    value={labelPositionX}
                    onChange={(val) => {
                      // handleChange(showindexSettings, "labelPositionX", val);
                      setLabelPositionX(val);
                    }}
                  />
                  <LabeledSlider
                    label="Label Position Y"
                    value={labelPositionY}
                    onChange={(val) => {
                      // handleChange(showindexSettings, "labelPositionY", val);
                      setLabelPositionY(val);
                    }}
                  />
                </div>

                <div className="border-gray-500 border-b pb-6 pt-6 md:pt-0 md:pb-0 md:border-b-0 md:border-r md:pr-3">
                  <input
                    type="text"
                    value={entries[showindexSettings]?.sublabel ?? ""}
                    onChange={(e) =>
                      handleChange(
                        showindexSettings,
                        "sublabel",
                        e.target.value
                      )
                    }
                    placeholder="Sublabel"
                    className="border rounded px-2 py-1 flex-1 min-w-[150px]"
                  />
                  <input
                    type="color"
                    value={
                      entries[showindexSettings]?.sublabelColour || "#000000"
                    }
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
                      // handleChange(showindexSettings, "sublabelFontSize", val);
                      setSublabelFontSize(val);
                    }}
                  />
                  <LabeledSlider
                    label="Sublabel Position X"
                    value={sublabelPositionX}
                    onChange={(val) => {
                      // handleChange(showindexSettings, "sublabelPositionX", val);
                      setSublabelPositionX(val);
                    }}
                  />
                  <LabeledSlider
                    label="Sublabel Position Y"
                    value={sublabelPositionY}
                    onChange={(val) => {
                      // handleChange(showindexSettings, "sublabelPositionY", val);
                      setSublabelPositionY(val);
                    }}
                  />
                </div>

                <div className="border-gray-500 border-b pb-6 pt-6 md:pt-0 md:pb-0 md:border-b-0">
                  <input
                    type="number"
                    value={entries[showindexSettings]?.value}
                    onChange={(e) =>
                      handleChange(showindexSettings, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="border rounded px-2 py-1 w-24"
                  />
                  <input
                    type="color"
                    value={entries[showindexSettings]?.valueColour || "#000000"}
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
                      // handleChange(showindexSettings, "valueFontSize", val);
                      setValueFontSize(val);
                    }}
                  />
                  <LabeledSlider
                    label="Value Position X"
                    value={valuePositionX}
                    onChange={(val) => {
                      // handleChange(showindexSettings, "valuePositionX", val);
                      setValuePositionX(val);
                    }}
                    initialMin={-100}
                    initialMax={0}
                  />
                  <LabeledSlider
                    label="Value Position Y"
                    value={valuePositionY}
                    onChange={(val) => {
                      // handleChange(showindexSettings, "valuePositionY", val);
                      setValuePositionY(val);
                    }}
                  />
                </div>
              </div>

              <div className="pb-6 pt-6">
                <LabeledSlider
                  label="Rounded Corners"
                  value={roundedCorners}
                  onChange={(val) => {
                    setRoundedCorners(val);
                  }}
                  initialMax={20}
                  initialMin={0}
                />

                <label className="flex">
                  Bar Foreground Color:
                  <PopoverPicker
                    color={foreGroundColor}
                    onChange={(e) => {
                      handleChange(showindexSettings, "fgColor", e);
                      setForeGroundColor(e);
                    }}
                  />
                </label>

                <label className="flex">
                  Bar Background Color:
                  <PopoverPicker
                    color={backGroundColor}
                    onChange={(e) => {
                      handleChange(showindexSettings, "bgColor", e);
                      setBackGroundColor(e);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
