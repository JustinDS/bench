"use client";
import { useFont } from "@/app/contexts/fontContext";
import { WebFont } from "@/app/dashboard/page";
import React, { useState, useEffect } from "react";

export interface FontPickerProps {
  fonts: WebFont[];
  selectedFont: string;
}

const FontPicker = ({ fonts, selectedFont }: FontPickerProps) => {
  const { setFont } = useFont();
  const [fontFamilies, setFontFamilies] = useState(fonts);
  const [selectedFontFamily, setSelectedFont] = useState(selectedFont);

  useEffect(() => {
    const handleFetch = async () => {
      const font = fontFamilies.find((x) => x.family === selectedFontFamily);

      const fontFile = font?.files["regular"];

      const googleFontsResponse = await fetch(`/api/font/ttf`, {
        method: "POST",
        body: JSON.stringify({
          fontUrl: fontFile,
        }),
      });

      setFont(await googleFontsResponse.text());
    };

    handleFetch();
  }, [fontFamilies, selectedFontFamily, setFont]);

  return (
    <div>
      <h1>Font Picker</h1>
      <select
        value={selectedFontFamily}
        onChange={(e) => setSelectedFont(e.target.value)}
        style={{ fontFamily: selectedFontFamily, fontSize: "16px" }}
      >
        {fontFamilies.map((font) => (
          <option
            key={font.family}
            value={font.family}
            style={{ fontFamily: font.family }}
          >
            {font.family}
          </option>
        ))}
      </select>
      <p style={{ fontFamily: selectedFontFamily, fontSize: "24px" }}>
        The quick brown fox jumps over the lazy dog.
      </p>
    </div>
  );
};

export default FontPicker;
