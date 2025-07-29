import useClickOutside from "@/hooks/colourPicker/useClickOutside";
import React, { useCallback, useRef, useState } from "react";
import { RgbaColor, RgbaColorPicker } from "react-colorful";

interface PopoverPickerProps {
  color: RgbaColor;
  onChange: (color: RgbaColor) => void;
}

export const PopoverPicker: React.FC<PopoverPickerProps> = ({
  color,
  onChange,
}) => {
  const popover = useRef<HTMLDivElement>(null);
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div className="picker">
      <div
        className="swatch"
        style={{
          backgroundColor: `rgba(${color.r},${color.g},${color.b},${color.a})`,
        }}
        onClick={() => toggle(true)}
      />

      {isOpen && (
        <div className="popover" ref={popover}>
          <div className="custom-pointers">
            <RgbaColorPicker color={color} onChange={onChange} />
          </div>
        </div>
      )}
    </div>
  );
};
