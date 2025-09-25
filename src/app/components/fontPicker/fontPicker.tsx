"use client";
import {
  FontSelection,
  Variant,
  WebFont,
  WebFontItem,
} from "@/app/dashboard/page";
import { Label } from "@radix-ui/react-label";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

export interface FontPickerProps {
  setFont: React.Dispatch<React.SetStateAction<FontSelection | undefined>>;
  fontSelection: FontSelection | undefined;
  mainLabel: string;
  variantLabel: string;
}

const FontPicker = ({
  setFont,
  fontSelection,
  mainLabel,
  variantLabel,
}: FontPickerProps) => {
  const [fontFamilies, setFontFamilies] = useState<WebFont[]>();
  const [selectedFontFamily, setSelectedFont] = useState<string>(
    fontSelection?.selectedFontFamily ?? ""
  );
  const [fontVariations, setFontVariations] = useState<Variant>(
    fontSelection?.variant ?? {}
  );
  const [selectedVariant, setSelectedVariant] = useState<string>(
    fontSelection?.selectedVariant ?? "regular"
  );

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const fontResponse = await fetch(`/api/font/googleFonts`, {
          method: "GET",
          cache: "force-cache",
        });

        const googleFonts: WebFontItem = await fontResponse.json();

        setFontFamilies(googleFonts?.items?.map((font) => font));
      } catch (error) {
        console.error(error);
      }
    };

    if (!fontFamilies) {
      handleFetch();
    }
  }, []);

  const getfontTtf = async (url: string | undefined) => {
    try {
      const googleFontsResponse = await fetch(`/api/font/ttf`, {
        method: "POST",
        body: JSON.stringify({
          fontUrl: url,
        }),
      });

      return await googleFontsResponse.text();
    } catch (error) {
      console.error(error);
    }
  };

  const selectFont = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = fontFamilies?.find((x) => x.family === e.target.value);
    setFontVariations(font?.files ?? {});
    setSelectedFont(e.target.value);
    setSelectedVariant("regular");

    const fontFile = font?.files[selectedVariant];

    const ttf = await getfontTtf(fontFile);

    setFont({
      ttf: ttf ?? "",
      selectedFontFamily: e.target.value,
      selectedVariant: "regular",
      variant: font?.files ?? {},
    });
  };

  const selectVariant = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariant(e.target.value);

    const ttf = await getfontTtf(fontVariations?.[e.target.value]);

    setFont({
      ttf: ttf ?? "",
      selectedFontFamily: selectedFontFamily,
      selectedVariant: e.target.value,
      variant: fontVariations,
    });
  };

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
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs font-medium text-gray-500">{mainLabel}</Label>
        <select
          value={selectedFontFamily}
          onChange={(e) => selectFont(e)}
          style={{ fontFamily: selectedFontFamily, fontSize: "16px" }}
          className="flex-1 h-8 text-sm border border-input bg-background px-3 py-1 rounded-md w-full"
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
      </div>

      {Object.keys(fontVariations).length !== 0 && (
        <div className="space-y-1">
          <Label className="text-xs font-medium text-gray-500">
            {variantLabel}
          </Label>
          <select
            value={selectedVariant}
            onChange={(e) => selectVariant(e)}
            style={{ fontFamily: selectedFontFamily, fontSize: "16px" }}
            className="flex-1 h-8 text-sm border border-input bg-background px-3 py-1 rounded-md w-full"
          >
            {Object.entries(fontVariations).map(([key, value]) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* <p style={{ fontFamily: selectedFontFamily, fontSize: "24px" }}>
        The quick brown fox jumps over the lazy dog.
      </p> */}
    </div>
  );
};

export default FontPicker;
