import React, { useRef } from "react";
import { Entry } from "../../chartInputManager/chartInputManager";

interface BarChartProps {
  data: Entry[];
  chartWidth?: number;
  barHeight?: number;
  barSpacing?: number;
  showindexSettings: (index: number) => void;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  chartWidth = 600,
  barHeight = 30,
  barSpacing = 15,
  showindexSettings,
}) => {
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

  return (
    <div className="relative">
      <div
        style={{
          width: chartWidth,
          height: chartHeight,
          position: "absolute",
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
        height={chartHeight}
        // type="image/svg+xml;charset=utf-8"
      >
        {data.map((d, i) => {
          const barWidth = (d.value / max) * chartWidth;
          const y = i * (barHeight + barSpacing);

          let hasSubLabel = false;

          let labelPosition = barHeight / 2 + (d?.labelPositionY ?? 5);
          let sublabelPosition = barHeight / 2 + (d?.sublabelPositionY ?? 12);

          if (d.sublabel) {
            hasSubLabel = true;
            labelPosition = barHeight / 2.5 + (d.labelPositionY ?? 5);
            sublabelPosition = barHeight / 2 + (d?.sublabelPositionY ?? 12);
          }

          return (
            <g key={i}>
              <rect
                x={0}
                y={y}
                width={chartWidth}
                height={barHeight}
                fill={d.bgColor || "#e0e0e0"}
                rx={10}
                ry={10}
              />
              <rect
                x={0}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={d.fgColor || "#4f46e5"}
                rx={10}
                ry={10}
              />
              <text
                x={d.labelPositionX ?? 10}
                y={y + labelPosition}
                fontSize={d?.labelFontSize ?? 14}
                fill={d.labelColour}
                style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
              >
                {d?.label}
              </text>
              {hasSubLabel && (
                <text
                  x={d.sublabelPositionX ?? 10}
                  y={y + sublabelPosition}
                  fontSize={d?.sublabelFontSize ?? 12}
                  fill={d.sublabelColour}
                  opacity={0.8}
                  style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                >
                  {d.sublabel}
                </text>
              )}
              <text
                x={chartWidth - Math.abs(d?.valuePositionX ?? 30)}
                y={y + barHeight / 2 + (d.valuePositionY ?? 5)}
                fontSize={d?.valueFontSize ?? 14}
                fill={d.valueColour}
                style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
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
