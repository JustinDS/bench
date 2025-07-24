import React, { useState, useEffect } from "react";

interface LabeledSliderProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  initialMin?: number;
  initialMax?: number;
  step?: number;
  unit?: string;
}

export const LabeledSlider: React.FC<LabeledSliderProps> = ({
  label,
  value,
  onChange,
  initialMin = 0,
  initialMax = 100,
  step = 1,
  unit = "",
}) => {
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);

  useEffect(() => {
    if (value < min) setMin(value);
    if (value > max) setMax(value);
  }, [value, min, max]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        {/* <span className="text-sm text-gray-600">
          {value}
          {unit}
        </span> */}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 px-1 py-0.5 text-sm border rounded"
        />
      </div>
    </div>
  );
};
