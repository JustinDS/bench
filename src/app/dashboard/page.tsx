import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ChartInputManager } from "../components/chartInputManager/chartInputManager";
import FontPicker from "../components/fontPicker/fontPicker";
import ClientDashboard from "./pageClient";

export interface WebFont {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Variant;
  category: string;
  kind: string;
  menu: string;
}

export interface Variant {
  [variant: string]: string;
}

export interface WebFontItem {
  items: WebFont[];
}

export interface FontSelection {
  variant: Variant;
  selectedFontFamily: string;
  selectedVariant: string;
  ttf: string;
}

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "role,subscription_code,subscription_expires_at,subscription_status"
    )
    .eq("id", user?.id)
    .single();

  const status = profile?.subscription_status;

  // let googleFonts: WebFontItem = { items: [] };

  // const apiKey = process.env.GOOGLE_FONTS_API_KEY;
  // try {
  //   const googleFontsResponse = await fetch(
  //     `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`,
  //     {
  //       method: "GET",
  //     }
  //   );

  //   googleFonts = await googleFontsResponse.json();
  // } catch (error) {
  //   console.error(error);
  // }

  // const fontFamilies = googleFonts?.items?.map((font) => font);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <ClientDashboard
      // fonts={fontFamilies}
      // selectedFont={fontFamilies[0].family}
      />
    </div>
  );
}
