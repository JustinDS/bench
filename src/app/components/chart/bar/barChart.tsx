import React, { useRef } from "react";
import { Entry } from "../../chartInputManager/chartInputManager";

interface BarChartProps {
  data: Entry[];
  showLabelInside?: boolean;
  chartWidth?: number;
  barHeight?: number;
  barSpacing?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  showLabelInside = true,
  chartWidth = 600,
  barHeight = 30,
  barSpacing = 15,
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
    <div>
      <button onClick={handleExportSvg}>export SVG</button>
      <svg
        ref={svgRef}
        width={chartWidth}
        height={chartHeight}
        type="image/svg+xml;charset=utf-8"
      >
        {data.map((d, i) => {
          const barWidth = (d.value / max) * chartWidth;
          const y = i * (barHeight + barSpacing);
          const labelX = showLabelInside ? 10 : barWidth + 10;

          let hasSubLabel = false;

          let labelPosition = barHeight / 2 + 5;
          let sublabelPosition = barHeight / 2 + 12;

          if (d.sublabel) {
            hasSubLabel = true;
            labelPosition = barHeight / 2.5 + 5;
            sublabelPosition = barHeight / 2 + 12;
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
                x={labelX}
                y={y + labelPosition}
                fontSize={14}
                fill={d.labelColour}
              >
                {d.label}
              </text>
              {hasSubLabel && (
                <text
                  x={labelX}
                  y={y + sublabelPosition}
                  fontSize={12}
                  fill={d.sublabelColour}
                  opacity={0.8}
                >
                  {d.sublabel}
                </text>
              )}
              <text
                x={chartWidth - 30}
                y={y + barHeight / 2 + 5}
                fontSize={14}
                fill={d.valueColour}
              >
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
