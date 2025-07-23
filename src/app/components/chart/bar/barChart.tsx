import React from "react";
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
  showLabelInside = false,
  chartWidth = 600,
  barHeight = 30,
  barSpacing = 15,
}) => {
  const chartHeight = data.length * (barHeight + barSpacing);
  const max = Math.max(...data.map((d) => d.value), 1); // prevent divide-by-zero

  return (
    <svg width={chartWidth} height={chartHeight}>
      {data.map((d, i) => {
        const barWidth = (d.value / max) * (chartWidth - 100);
        const y = i * (barHeight + barSpacing);
        const labelX = showLabelInside ? 10 : barWidth + 10;
        const labelColor = showLabelInside ? "#fff" : "#333";

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
              width={barWidth}
              height={barHeight}
              fill="#007acc"
              rx={10}
              ry={10}
            />
            <text
              x={labelX}
              y={y + labelPosition}
              fontSize={14}
              fill={labelColor}
            >
              {d.label}
            </text>
            {hasSubLabel && (
              <text
                x={labelX}
                y={y + sublabelPosition}
                fontSize={12}
                fill={labelColor}
                opacity={0.8}
              >
                {d.sublabel}
              </text>
            )}
            <text
              x={barWidth + 60}
              y={y + barHeight / 2 + 5}
              fontSize={14}
              fill="#555"
            >
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
