"use client";
import { WebFont, WebFontItem } from "@/app/dashboard/page";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

export interface FontPickerProps {
  setFont: Dispatch<SetStateAction<string>>;
}

const FontPicker = ({ setFont }: FontPickerProps) => {
  const [fontFamilies, setFontFamilies] = useState<WebFont[]>();
  const [selectedFontFamily, setSelectedFont] = useState<string>();

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const fontResponse = await fetch(`/api/font/googleFonts`, {
          method: "GET",
        });

        debugger;

        const googleFonts: WebFontItem = await fontResponse.json();

        setFontFamilies(googleFonts?.items?.map((font) => font));
      } catch (error) {
        console.error(error);
      }
    };

    handleFetch();
  }, []);

  useEffect(() => {
    const handleFetch = async () => {
      const font = fontFamilies?.find((x) => x.family === selectedFontFamily);

      const fontFile = font?.files["regular"];

      console.log("font", font);

      try {
        const googleFontsResponse = await fetch(`/api/font/ttf`, {
          method: "POST",
          body: JSON.stringify({
            fontUrl: fontFile,
          }),
        });

        setFont(await googleFontsResponse.text());
      } catch (error) {
        console.error(error);
      }
    };

    handleFetch();
  }, [fontFamilies, selectedFontFamily, setFont]);

  useEffect(() => {
    // const font = fontFamilies.find((x) => x.family === selectedFontFamily);
    const fontLink = `https://fonts.googleapis.com/css2?family=${selectedFontFamily?.replace(
      / /g,
      "+"
    )}:wght@400&display=swap`;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontLink;

    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [selectedFontFamily]);

  return (
    <div>
      <h1>Font Picker</h1>
      <select
        value={selectedFontFamily}
        onChange={(e) => setSelectedFont(e.target.value)}
        style={{ fontFamily: selectedFontFamily, fontSize: "16px" }}
      >
        {fontFamilies?.map((font) => (
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
