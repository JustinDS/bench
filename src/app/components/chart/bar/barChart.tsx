import React, { useRef } from "react";
import { Entry } from "../../chartInputManager/chartInputManager";
import { useFont } from "@/app/contexts/fontContext";

interface BarChartProps {
  data: Entry[];
  chartWidth?: number;
  barHeight?: number;
  barSpacing?: number;
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

  chartSubTitle: string;
  chartSubTitleColour: string;
  chartSubTitleFontSize: number;
  chartSubTitlePositionX: number;
  chartSubTitlePositionY: number;

  chartTitle: string;
  chartTitleColour: string;
  chartTitleFontSize: number;
  chartTitlePositionX: number;
  chartTitlePositionY: number;
  showindexSettings: (index: number) => void;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  chartWidth = 600,
  barHeight = 30,
  barSpacing = 15,
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
  const chartHeight = data.length * (barHeight + barSpacing);
  const max = Math.max(...data.map((d) => d.value), 1); // prevent divide-by-zero
  const svgRef = useRef(null);

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

  let chartTitlePosition = chartTitleHeight / 2 + (chartTitlePositionY ?? 5);
  let chartSubTitlePosition =
    chartTitleHeight / 2 + (chartSubTitlePositionY ?? 12);
  let hasChartSubTitle = false;

  if (chartSubTitle) {
    hasChartSubTitle = true;
    chartTitlePosition = chartTitleHeight / 2.5 + (chartTitlePositionY ?? 5);
    chartSubTitlePosition =
      chartTitleHeight / 2 + (chartSubTitlePositionY ?? 12);
  }

  return (
    <div className="relative">
      <div
        style={{
          width: chartWidth,
          height: chartHeight,
          position: "absolute",
          marginTop: chartTitleHeight,
        }}
      >
        {data.map((d, i) => {
          return (
            <div
              key={i}
              style={{
                width: chartWidth,
                height: barHeight,
                marginBottom: `${barSpacing}px`,
              }}
              className="hover:border-2 hover:border-black rounded-lg"
              onClick={() => showindexSettings(i)}
            />
          );
        })}
      </div>
      <svg
        ref={svgRef}
        width={chartWidth}
        height={chartHeight + chartTitleHeight}
        // type="image/svg+xml;charset=utf-8"
      >
        <defs>
          <style>{`
          @font-face {
            font-family: 'MyFont';
            src: url(${font}) format('truetype');
          }
        `}</style>
        </defs>
        <g>
          <rect width="100%" height="100%" fill={"rgba(0,0,0,0.5)"} />
          <text
            x={chartTitlePositionX}
            y={chartTitlePosition}
            fontSize={chartTitleFontSize ?? 14}
            style={{ fontFamily: "MyFont" }}
            fill={chartTitleColour || "#e0e0e0"}
          >
            {chartTitle}
          </text>
          {hasChartSubTitle ? (
            <text
              x={chartSubTitlePositionX}
              y={chartSubTitlePosition}
              fontSize={chartSubTitleFontSize ?? 12}
              style={{ fontFamily: "MyFont" }}
              fill={chartSubTitleColour || "#e0e0e0"}
            >
              {chartSubTitle}
            </text>
          ) : null}
        </g>

        {data.map((d, i) => {
          const barWidth = (d.value / max) * chartWidth;
          const y = i * (barHeight + barSpacing) + chartTitleHeight;

          let hasSubLabel = false;

          let labelPosition = barHeight / 2 + (labelPositionY ?? 5);
          let sublabelPosition = barHeight / 2 + (sublabelPositionY ?? 12);

          if (d.sublabel) {
            hasSubLabel = true;
            labelPosition = barHeight / 2.5 + (labelPositionY ?? 5);
            sublabelPosition = barHeight / 2 + (sublabelPositionY ?? 12);
          }

          return (
            <g key={i}>
              <rect
                x={0}
                y={y}
                width={chartWidth}
                height={barHeight}
                fill={
                  `rgba(${d?.bgColor?.r},${d?.bgColor?.g},${d?.bgColor?.b},${d?.bgColor?.a})` ||
                  "#e0e0e0"
                }
                rx={roundedCorners}
                ry={roundedCorners}
              />
              <rect
                x={0}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={
                  `rgba(${d?.fgColor?.r},${d?.fgColor?.g},${d?.fgColor?.b},${d?.fgColor?.a})` ||
                  "#4f46e5"
                }
                rx={roundedCorners}
                ry={roundedCorners}
              />
              <text
                x={labelPositionX ?? 10}
                y={y + labelPosition}
                fontSize={labelFontSize ?? 14}
                fill={d.labelColour}
                style={{ fontFamily: "MyFont" }}
              >
                {d?.label}
              </text>
              {hasSubLabel && (
                <text
                  x={sublabelPositionX ?? 10}
                  y={y + sublabelPosition}
                  fontSize={sublabelFontSize ?? 12}
                  fill={d.sublabelColour}
                  opacity={0.8}
                  style={{ fontFamily: "MyFont" }}
                >
                  {d.sublabel}
                </text>
              )}
              <text
                x={chartWidth - Math.abs(valuePositionX ?? 30)}
                y={y + barHeight / 2 + (valuePositionY ?? 5)}
                fontSize={valueFontSize ?? 14}
                fill={d.valueColour}
                textAnchor="end"
                style={{ fontFamily: "MyFont" }}
              >
                {d.value}
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
