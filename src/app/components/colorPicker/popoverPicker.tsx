import useClickOutside from "@/hooks/colourPicker/useClickOutside";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { RgbaColor, RgbaColorPicker } from "react-colorful";
import { Copy, ClipboardPaste } from "lucide-react";

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
  const [clipboardColor, setClipboardColor] = useState<RgbaColor | null>(null);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  // Helpers
  const rgbaString = (c: RgbaColor) =>
    `rgba(${c.r}, ${c.g}, ${c.b}, ${parseFloat(c.a.toFixed(2))})`;

  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  const rgbaToHex = (c: RgbaColor) =>
    `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}${toHex(Math.round(c.a * 255))}`;

  const parseInput = (val: string): RgbaColor | null => {
    val = val.trim();

    // Hex
    if (/^#([0-9A-F]{6}|[0-9A-F]{8})$/i.test(val)) {
      const r = parseInt(val.slice(1, 3), 16);
      const g = parseInt(val.slice(3, 5), 16);
      const b = parseInt(val.slice(5, 7), 16);
      const a = val.length === 9 ? parseInt(val.slice(7, 9), 16) / 255 : 1;
      return { r, g, b, a };
    }

    // RGBA
    const match = val.match(
      /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*([\d.]+)?\s*\)/
    );
    if (match) {
      const [, r, g, b, a] = match;
      return {
        r: Math.min(255, parseInt(r)),
        g: Math.min(255, parseInt(g)),
        b: Math.min(255, parseInt(b)),
        a: a !== undefined ? Math.min(1, parseFloat(a)) : 1,
      };
    }

    return null;
  };

  // Check clipboard for a valid color
  const checkClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = parseInput(text);
      setClipboardColor(parsed);
    } catch (err) {
      console.warn("Clipboard access failed", err);
    }
  };

  const handlePaste = () => {
    if (clipboardColor) {
      onChange(clipboardColor);
      setClipboardColor(null);
    }
  };

  const handleChannelChange = (key: keyof RgbaColor, value: string) => {
    const parsed = parseInput(value);
    if (parsed) {
      onChange(parsed);
      return;
    }

    // Treat as numeric
    let numeric = key === "a" ? parseFloat(value) : parseInt(value);
    if (isNaN(numeric)) return;

    numeric =
      key === "a"
        ? Math.min(1, Math.max(0, numeric))
        : Math.min(255, Math.max(0, numeric));

    onChange({ ...color, [key]: numeric });
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Automatically check clipboard when popover opens
  useEffect(() => {
    if (isOpen) checkClipboard();
  }, [isOpen]);

  return (
    <div className="picker">
      <div
        className="swatch"
        style={{ backgroundColor: rgbaString(color) }}
        onClick={() => toggle(true)}
      />

      {isOpen && (
        <div
          className="popover p-3 rounded-md bg-white shadow-md space-y-3"
          ref={popover}
        >
          <RgbaColorPicker
            color={color}
            onChange={onChange}
            className="!w-full"
          />

          {/* Separate RGBA inputs */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={color.r}
              onChange={(e) => handleChannelChange("r", e.target.value)}
              className="w-14 border rounded px-1"
              placeholder="R"
            />
            <input
              type="text"
              value={color.g}
              onChange={(e) => handleChannelChange("g", e.target.value)}
              className="w-14 border rounded px-1"
              placeholder="G"
            />
            <input
              type="text"
              value={color.b}
              onChange={(e) => handleChannelChange("b", e.target.value)}
              className="w-14 border rounded px-1"
              placeholder="B"
            />
            <input
              type="text"
              value={parseFloat(color.a.toFixed(2))}
              onChange={(e) => handleChannelChange("a", e.target.value)}
              className="w-14 border rounded px-1"
              placeholder="A"
            />
          </div>

          {/* Copy buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(rgbaString(color))}
              className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 flex"
            >
              <Copy className="pr-1" /> RGBA
            </button>
            <button
              onClick={() => handleCopy(rgbaToHex(color))}
              className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 flex"
            >
              <Copy className="pr-1" /> HEX
            </button>
          </div>

          {/* Clipboard paste button */}
          {clipboardColor && (
            <button
              onClick={handlePaste}
              className="px-2 py-1 rounded bg-purple-500 text-white hover:bg-purple-600 flex"
            >
              <ClipboardPaste className="pr-1" /> from Clipboard
            </button>
          )}
        </div>
      )}
    </div>
  );
};
