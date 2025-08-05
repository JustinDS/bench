import React, { useRef, useState } from "react";
import { Entry } from "../../chartInputManager/chartInputManager";
import { useFont } from "@/app/contexts/fontContext";
import { RgbaColor } from "react-colorful";

interface BarChartProps {
  data: Entry[];
  chartWidth?: number;
  barHeight?: number;
  barSpacing?: number;
  barWidth?: number;
  labelFontSize: number;
  valueFontSize: number;
  valuePositionX: number;
  valuePositionY: number;
  labelPositionX: number;
  labelPositionY: number;
  sublabelFontSize: number;
  sublabelPositionX: number;
  sublabelPositionY: number;
  roundedCorners: number;
  chartTitleHeight: number;
  chartTitle: string;
  chartTitleColour: string;
  chartTitleFontSize: number;
  chartTitlePositionX: number;
  chartTitlePositionY: number;
  chartSubTitle: string;
  chartSubTitleColour: string;
  chartSubTitleFontSize: number;
  chartSubTitlePositionX: number;
  chartSubTitlePositionY: number;
  backgroundColour: RgbaColor;
  hasBackground: boolean;
  showindexSettings: (index: number) => void;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  chartWidth = 600,
  barHeight = 30,
  barSpacing = 15,
  barWidth = 600,
  backgroundColour,
  hasBackground,
  labelFontSize,
  valueFontSize,
  labelPositionX,
  labelPositionY,
  sublabelFontSize,
  sublabelPositionX,
  sublabelPositionY,
  valuePositionX,
  valuePositionY,
  roundedCorners,
  chartTitleHeight,
  chartTitle,
  chartTitleColour,
  chartTitleFontSize,
  chartTitlePositionX,
  chartTitlePositionY,
  chartSubTitle,
  chartSubTitleColour,
  chartSubTitleFontSize,
  chartSubTitlePositionX,
  chartSubTitlePositionY,
  showindexSettings,
}) => {
  const { font } = useFont();
  const svgRef = useRef(null);
  const chartHeight = data.length * (barHeight + barSpacing);
  const max = Math.max(...data.map((d) => d.value), 1);
  const barTotalWidth = barWidth;

  const [selectedBarId, setSelectedBarId] = useState<number>(0);

  const handleExportSvg = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "bar-chart.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  const hasChartSubTitle = Boolean(chartSubTitle);
  const chartTitleY = hasChartSubTitle
    ? chartTitleHeight / 2.5 + chartTitlePositionY
    : chartTitleHeight / 2 + chartTitlePositionY;
  const chartSubTitleY = chartTitleHeight / 2 + chartSubTitlePositionY;

  const handleSelectedBar = (index: number) => {
    showindexSettings(index);
    setSelectedBarId(index);
  };

  return (
    <div className="relative">
      {/* <div
        style={{
          width: chartWidth,
          height: chartHeight,
          position: "absolute",
          marginTop: chartTitleHeight,
        }}
      >
        {data.map((_, i) => (
          <div
            key={i}
            style={{
              width: barTotalWidth,
              height: barHeight,
              marginBottom: barSpacing,
              marginLeft: "auto",
              marginRight: "auto",
            }}
            className="hover:border-2 hover:border-black rounded-lg"
            onClick={() => showindexSettings(i)}
          />
        ))}
      </div> */}

      <svg
        preserveAspectRatio="xMidYMid meet"
        ref={svgRef}
        width={chartWidth}
        height={chartHeight + chartTitleHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight + chartTitleHeight}`}
        style={{
          width: "100%",
          maxWidth: "100vw",
          height: "auto",
          display: "block",
        }}
      >
        <defs>
          <style>{`
            @font-face {
              font-family: 'MyFont';
              src: url(${font}) format('truetype');
            }
          `}</style>
        </defs>

        {hasBackground && (
          <rect
            width="100%"
            height="100%"
            fill={`rgba(${backgroundColour.r},${backgroundColour.g},${backgroundColour.b},${backgroundColour.a})`}
          />
        )}

        <text
          x={chartTitlePositionX}
          y={chartTitleY}
          fontSize={chartTitleFontSize}
          style={{ fontFamily: "MyFont" }}
          fill={chartTitleColour}
        >
          {chartTitle}
        </text>

        {hasChartSubTitle && (
          <text
            x={chartSubTitlePositionX}
            y={chartSubTitleY}
            fontSize={chartSubTitleFontSize}
            style={{ fontFamily: "MyFont" }}
            fill={chartSubTitleColour}
          >
            {chartSubTitle}
          </text>
        )}

        {data.map((bar, i) => {
          const barActualWidth = (bar.value / max) * barTotalWidth;
          const y = i * (barHeight + barSpacing) + chartTitleHeight;
          const hasSubLabel = Boolean(bar.sublabel);

          const labelY = hasSubLabel
            ? barHeight / 2.5 + labelPositionY
            : barHeight / 2 + labelPositionY;

          const sublabelY = barHeight / 2 + sublabelPositionY;

          return (
            <g key={i} onClick={() => handleSelectedBar(i)}>
              <rect
                x={chartWidth / 2 - barTotalWidth / 2}
                y={y}
                width={barTotalWidth}
                height={barHeight}
                fill={`rgba(${bar.bgColor?.r},${bar.bgColor?.g},${bar.bgColor?.b},${bar.bgColor?.a})`}
                rx={roundedCorners}
                ry={roundedCorners}
                stroke={
                  selectedBarId === i
                    ? `rgba(${255 - (bar?.bgColor?.r ?? 0)},${
                        255 - (bar.bgColor?.g ?? 0)
                      },${255 - (bar.bgColor?.b ?? 0)},${bar.bgColor?.a})`
                    : "#e2e8f0"
                }
                strokeWidth={selectedBarId === i ? 2 : 1}
                strokeDasharray={selectedBarId === i ? "5,5" : "none"}
              />
              <rect
                x={chartWidth / 2 - barTotalWidth / 2}
                y={y}
                width={barActualWidth}
                height={barHeight}
                fill={`rgba(${bar.fgColor?.r},${bar.fgColor?.g},${bar.fgColor?.b},${bar.fgColor?.a})`}
                rx={roundedCorners}
                ry={roundedCorners}
                stroke={
                  selectedBarId === i
                    ? `rgba(${255 - (bar?.fgColor?.r ?? 0)},${
                        255 - (bar.fgColor?.g ?? 0)
                      },${255 - (bar.fgColor?.b ?? 0)},${bar.bgColor?.a})`
                    : "#e2e8f0"
                }
                strokeWidth={selectedBarId === i ? 2 : 1}
                strokeDasharray={selectedBarId === i ? "5,5" : "none"}
              />
              <text
                x={chartWidth / 2 - barTotalWidth / 2 + labelPositionX}
                y={y + labelY}
                fontSize={labelFontSize}
                fill={bar.labelColour}
                style={{ fontFamily: "MyFont" }}
              >
                {bar.label}
              </text>
              {hasSubLabel && (
                <text
                  x={chartWidth / 2 - barTotalWidth / 2 + sublabelPositionX}
                  y={y + sublabelY}
                  fontSize={sublabelFontSize}
                  fill={bar.sublabelColour}
                  opacity={0.8}
                  style={{ fontFamily: "MyFont" }}
                >
                  {bar.sublabel}
                </text>
              )}
              <text
                x={chartWidth / 2 + barTotalWidth / 2 + valuePositionX}
                y={y + barHeight / 2 + valuePositionY}
                fontSize={valueFontSize}
                fill={bar.valueColour}
                textAnchor="end"
                style={{ fontFamily: "MyFont" }}
              >
                {bar.value}
              </text>
            </g>
          );
        })}
      </svg>

      <button
        className="bg-gray-700 text-white py-2 px-2 rounded-lg hover:bg-gray-700 transition cursor-pointer mt-4 mb-4"
        onClick={handleExportSvg}
      >
        Export Chart
      </button>
    </div>
  );
};
