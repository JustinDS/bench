"use client";

import React from "react";

type Machine = {
  name: string;
  score: number;
  isCurrent?: boolean;
};

const data: Machine[] = [
  { name: "gpu 1", score: 110 },
  { name: "gpu 2", score: 100 },
  { name: "gpu 3", score: 85 },
  { name: "gpu 4", score: 70 },
  { name: "gpu 5", score: 55 },
  { name: "gpu 6", score: 55 },
  { name: "gpu 7", score: 55 },
  { name: "gpu 8", score: 25 },
];

export default function HorizontalBarChart() {
  const width = 600;
  const barHeight = 25;
  const barSpacing = 12;
  const padding = 50;
  const maxScore = Math.max(...data.map((d) => d.score));

  return (
    <svg width={width} height={data.length * (barHeight + barSpacing)}>
      {data.map((d, i) => {
        const barWidth = (d.score / maxScore) * (width - padding - 10);
        const y = i * (barHeight + barSpacing);

        return (
          <g key={i}>
            {/* Label */}
            <text x={0} y={y + barHeight / 1.5} fontSize="12">
              {d.name}
            </text>

            {/* Bar */}
            <rect
              x={padding}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={"#007acc"}
              rx={10}
              ry={10}
            />

            {/* Score text */}
            <text
              x={padding + barWidth + 5}
              y={y + barHeight / 1.5}
              fontSize="12"
            >
              {d.score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
