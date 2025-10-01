import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFont } from "@/app/contexts/fontContext";
import { RgbaColor } from "react-colorful";
import { Button } from "../../ui/button";
import {
  Copy,
  Download,
  Palette,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { PopoverPicker } from "../../colorPicker/popoverPicker";
import { v4 as uuidv4 } from "uuid";
import FontPicker from "../../fontPicker/fontPicker";
import { FontSelection } from "@/app/dashboard/page";
import { DashboardProps } from "@/app/dashboard/pageClient";
import { setgroups } from "process";

interface ChartBar {
  id: string;
  titleDescription: TitleDescriptionSection;
  value: Value;
  backgroundColor: RgbaColor;
  foreGroundColor: RgbaColor;
  groupId?: string;
  categoryId?: string;
}

interface ChartGroup {
  id: string;
  titleDescription: TitleDescriptionSection;
  backgroundColor: RgbaColor;
  collapsed: boolean;
}

interface Text {
  value: string;
  color: string;
  fontSize: number;
  positionX?: number;
  poisitonY?: number;
}

interface Value {
  value: number;
  color: string;
  fontSize: number;
  positionX?: number;
  poisitonY?: number;
  prefix?: string;
  postfix?: string;
}

interface TitleDescriptionSection {
  label: Text;
  description?: Text;
  gap?: number;
  padding: Padding;
}

interface Background {
  color?: RgbaColor;
  width: number;
  height: number;
  backgroundURL?: string;
}

type BarValuePositionKeys =
  | "onForegroundRight"
  | "onBackgroundLeft"
  | "onBackgroundRight"
  | "outside";

interface BarValuePosition {
  key: BarValuePositionKeys;
  label: string;
}

const barValuePositions: BarValuePosition[] = [
  {
    key: "onForegroundRight",
    label: "On Foreground Right",
  },
  {
    key: "onBackgroundLeft",
    label: "On Background Left",
  },
  {
    key: "onBackgroundRight",
    label: "On Background Right",
  },
  {
    key: "outside",
    label: "Outside Right",
  },
];

type GroupLabelPositionKeys = "left" | "center" | "right" | "replaceBarLabels";

interface GroupLabelPosition {
  key: GroupLabelPositionKeys;
  label: string;
}

const GroupLabelPositions: GroupLabelPosition[] = [
  {
    key: "left",
    label: "Left Align",
  },
  {
    key: "center",
    label: "Center Align",
  },
  {
    key: "right",
    label: "Right Align",
  },
  {
    key: "replaceBarLabels",
    label: "Replace Bar Label",
  },
];

type Sort = "asc" | "des" | "none";

interface SortOrderProps {
  key: Sort;
  label: string;
}

const SortOrder: SortOrderProps[] = [
  {
    key: "asc",
    label: "Ascending",
  },
  {
    key: "des",
    label: "Descending",
  },
  {
    key: "none",
    label: "None",
  },
];

interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface GroupSettings {
  labelFontSize: number;
  descriptionFontSize?: number;
  padding: Padding;
  labelPosition: GroupLabelPositionKeys;
  roundedCorners: number;
}

interface BarSettings {
  labelWidth: number;
  labelInside: boolean;
  valuePosition: BarValuePositionKeys;
  labelFontSize?: number;
  descriptionFontSize?: number;
  valueFontSize: number;
  roundedCorners: number;
}

interface Settings {
  group: GroupSettings;
  bar: BarSettings;
  xAxisLabelFontSize: number;
  hideXAxis: boolean;
  hideYAxis: boolean;
  sort: Sort;
}

interface ChartCategory {
  id: string;
  label: string;
  color: RgbaColor;
}

interface ChartLegend {
  label: string;
  fontSize: number;
  color: string;
  padding: Padding;
  gap: number;
}

interface ChartTemplate {
  id: string;
  width: number;
  chartTitleSection: TitleDescriptionSection;
  background: Background;
  categories: ChartCategory[];
  groups: ChartGroup[];
  bars: ChartBar[];
  chartType: "horizontal" | "vertical";
  barSpacing: number;
  groupSpacing: number;
  settings: Settings;
}

interface ModalState {
  isOpen: boolean;
  type: "bar" | "group" | "titleSection" | "chart" | "legend" | null;
  itemId?: string | null;
  position: { x: number; y: number };
}

const defaultTemplates: ChartTemplate[] = [
  {
    id: "GpuCpu",
    width: 1000,
    chartTitleSection: {
      label: { value: "CPU GPU Compare", color: "#000000", fontSize: 16 },
      description: {
        value: "Compare AMD and Intel",
        color: "#000000",
        fontSize: 14,
      },
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
      gap: 5,
    },
    background: {
      color: { r: 0, g: 0, b: 0, a: 1 },
      width: 1280,
      height: 1300,
      backgroundURL: "",
    },
    chartType: "horizontal",
    barSpacing: 10,
    groupSpacing: 15,
    settings: {
      bar: {
        labelInside: true,
        valuePosition: "outside",
        labelFontSize: 14,
        descriptionFontSize: 14,
        labelWidth: 140,
        roundedCorners: 5,
        valueFontSize: 14,
      },
      group: {
        labelFontSize: 16,
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
        labelPosition: "replaceBarLabels",
        roundedCorners: 5,
        //groupDescriptionFontSize: 14,
      },
      xAxisLabelFontSize: 12,
      hideXAxis: true,
      hideYAxis: true,
      sort: "des",
    },
    categories: [
      // { id: "max", label: "Max", color: { r: 0, g: 0, b: 0, a: 1 } },
      // { id: "avg", label: "Average", color: { r: 0, g: 0, b: 0, a: 1 } },
      // { id: "min", label: "Min", color: { r: 0, g: 0, b: 0, a: 1 } },
    ],
    groups: [
      {
        id: "HighCPU",
        titleDescription: {
          label: { value: "High CPU", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
        },
        backgroundColor: { r: 139, g: 92, b: 246, a: 0.2 },
        collapsed: false,
      },
      {
        id: "HighGPU",
        titleDescription: {
          label: { value: "High CPU", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
        },
        backgroundColor: { r: 139, g: 92, b: 246, a: 0.2 },
        collapsed: false,
      },
      {
        id: "MediumCPU",
        titleDescription: {
          label: { value: "Medium CPU", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
        },
        backgroundColor: { r: 16, g: 185, b: 129, a: 0.2 },
        collapsed: false,
      },
      {
        id: "MediumGPU",
        titleDescription: {
          label: { value: "Medium CPU", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
        },
        backgroundColor: { r: 16, g: 185, b: 129, a: 0.2 },
        collapsed: false,
      },
      {
        id: "LowCPU",
        titleDescription: {
          label: { value: "Low CPU", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
        },
        backgroundColor: { r: 192, g: 132, b: 252, a: 0.2 },
        collapsed: false,
      },
      {
        id: "LowGPU",
        titleDescription: {
          label: { value: "Low CPU", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
        },
        backgroundColor: { r: 192, g: 132, b: 252, a: 0.2 },
        collapsed: false,
      },
    ],
    bars: [
      {
        id: uuidv4(),
        titleDescription: {
          label: { value: "AMD CPU", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        value: {
          value: 4500,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        groupId: "HighCPU",
      },
      {
        id: uuidv4(),
        titleDescription: {
          label: { value: "Intel CPU", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        value: {
          value: 4800,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "HighCPU",
      },
      {
        id: uuidv4(),
        titleDescription: {
          label: { value: "AMD GPU", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        value: {
          value: 5200,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "HighGPU",
      },
      {
        id: uuidv4(),
        titleDescription: {
          label: { value: "Geforce GPU", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        value: {
          value: 6100,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "HighGPU",
      },
      {
        id: uuidv4(),
        titleDescription: {
          label: { value: "AMD CPU", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        value: {
          value: 4500,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        groupId: "MediumCPU",
      },
      {
        id: uuidv4(),
        titleDescription: {
          label: { value: "Intel CPU", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        value: {
          value: 4800,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "MediumCPU",
      },
      {
        id: uuidv4(),
        titleDescription: {
          label: { value: "AMD GPU", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        value: {
          value: 5200,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "MediumGPU",
      },
      {
        id: uuidv4(),
        titleDescription: {
          label: { value: "Geforce GPU", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        value: {
          value: 100,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "MediumGPU",
      },
      {
        id: uuidv4(),
        titleDescription: {
          label: { value: "AMD CPU", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        value: {
          value: 4500,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        groupId: "LowCPU",
      },
      {
        id: uuidv4(),
        titleDescription: {
          label: { value: "Intel CPU", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        value: {
          value: 4800,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "LowCPU",
      },
      {
        id: uuidv4(),
        titleDescription: {
          label: { value: "AMD GPU", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        value: {
          value: 5200,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "LowGPU",
      },
      {
        id: uuidv4(),
        titleDescription: {
          label: { value: "Geforce GPU", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        value: {
          value: 6100,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "LowGPU",
      },
    ],
  },
];

const colorOptions = [
  { name: "Purple", value: "#8B5CF6" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Emerald", value: "#059669" },
  { name: "Amber", value: "#D97706" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Violet", value: "#7C3AED" },
];

export const GroupedBarChart = ({ font }: DashboardProps) => {
  //const { font } = useFont();

  const [chartType, setChartType] = useState<"horizontal" | "vertical">(
    "horizontal"
  );
  const [chartFont, setChartFont] = useState<FontSelection | undefined>(
    font ?? undefined
  );
  const [chartTitleFont, setChartTitleFont] = useState<FontSelection>();
  const [groupNameFont, setGroupNameFont] = useState<FontSelection>();
  const [groupDescriptionFont, setGroupDescriptionFont] =
    useState<FontSelection>();
  const [chartDescriptionFont, setChartDescriptionFont] =
    useState<FontSelection>();
  const [barLabelFont, setBarLabelFont] = useState<FontSelection>();
  const [barDescriptionFont, setBarDescriptionFont] = useState<FontSelection>();
  const [barValueFont, setBarValueFont] = useState<FontSelection>();
  const [chartWidth, setChartWidth] = useState(1000);
  const [chartBackgroundWidth, setChartBackgroundWidth] = useState(1200);
  const [chartBackgroundHeight, setChartBackgroundHeight] = useState(500);
  const [chartBackgroundColor, setChartBackgroundColor] = useState({
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  });
  const [groupSpacing, setGroupSpacing] = useState(15);
  const [barSpacing, setBarSpacing] = useState(10);
  const [barHeight, setBarHeight] = useState(60);
  const [settings, setSettings] = useState<Settings>({
    bar: {
      labelInside: false,
      valuePosition: "onBackgroundLeft",
      labelFontSize: 14,
      descriptionFontSize: 14,
      labelWidth: 140,
      roundedCorners: 5,
      valueFontSize: 14,
    },
    group: {
      labelFontSize: 16,
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
      labelPosition: "left",
      roundedCorners: 5,
      descriptionFontSize: 14,
    },
    xAxisLabelFontSize: 12,
    hideXAxis: true,
    hideYAxis: true,
    sort: "des",
  });

  const [chartLegend, setChartLegend] = useState<ChartLegend>({
    color: "#000000",
    fontSize: 16,
    gap: 10,
    label: "Category Legend",
    padding: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    },
  });

  const [categories, setCategories] = useState<ChartCategory[]>([
    { id: "max", label: "Max", color: { r: 60, g: 179, b: 113, a: 1 } },
    { id: "min", label: "Min", color: { r: 255, g: 165, b: 0, a: 1 } },
  ]);

  const [chartTitleSection, setChartTitleSection] =
    useState<TitleDescriptionSection>({
      label: {
        value: "Chart",
        color: "#000000",
        fontSize: 16,
      },
      description: {
        value: "Description",
        color: "#000000",
        fontSize: 14,
      },
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
      gap: 5,
    });
  const [groups, setGroups] = useState<ChartGroup[]>([
    {
      id: "group1",
      titleDescription: {
        label: { value: "Group A", color: "#000000", fontSize: 16 },
        description: { value: "Des", color: "#000000", fontSize: 14 },
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
        gap: 5,
      },
      backgroundColor: { r: 139, g: 92, b: 246, a: 0.2 },
      collapsed: false,
    },
    {
      id: "group2",
      titleDescription: {
        label: { value: "Group B", color: "#000000", fontSize: 16 },
        description: { value: "Des", color: "#000000", fontSize: 14 },
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
        gap: 5,
      },
      backgroundColor: { r: 139, g: 92, b: 246, a: 0.2 },
      collapsed: false,
    },
  ]);
  const [bars, setBars] = useState<ChartBar[]>([
    {
      id: "1",
      titleDescription: {
        label: { value: "Item 1", color: "#000000", fontSize: 16 },
        description: { value: "test", color: "#000000", fontSize: 16 },
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
        gap: 5,
      },
      value: {
        value: 400,
        color: "#000000",
        fontSize: 16,
        postfix: "",
        prefix: "",
      },
      backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
      foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
      groupId: "group1",
      categoryId: "max",
    },
    {
      id: "2",
      titleDescription: {
        label: { value: "Item 2", color: "#000000", fontSize: 16 },
        description: { value: "test", color: "#000000", fontSize: 16 },
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
        gap: 5,
      },
      value: {
        value: 300,
        color: "#000000",
        fontSize: 16,
        postfix: "",
        prefix: "",
      },
      backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
      foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
      groupId: "group1",
      categoryId: "min",
    },
    {
      id: "3",
      titleDescription: {
        label: { value: "Item 3", color: "#000000", fontSize: 16 },
        description: { value: "test", color: "#000000", fontSize: 16 },
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
        gap: 5,
      },
      value: {
        value: 500,
        color: "#000000",
        fontSize: 16,
        postfix: "",
        prefix: "",
      },
      backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
      foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
      groupId: "group2",
      categoryId: "max",
    },
    {
      id: "4",
      titleDescription: {
        label: { value: "Item 4", color: "#000000", fontSize: 16 },
        description: { value: "test", color: "#000000", fontSize: 16 },
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
        gap: 5,
      },
      value: {
        value: 200,
        color: "#000000",
        fontSize: 16,
        postfix: "",
        prefix: "",
      },
      backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
      foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
      groupId: "group2",
      categoryId: "min",
    },
  ]);

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    itemId: null,
    position: { x: 0, y: 0 },
  });

  const chartRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
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

  const handleExportJson = () => {
    const jsonString = JSON.stringify(
      {
        settings,
        chartFont,
        chartTitleFont,
        groupNameFont,
        groupDescriptionFont,
        chartDescriptionFont,
        barValueFont,
        chartWidth,
        chartBackgroundWidth,
        chartBackgroundHeight,
        chartBackgroundColor,
        groupSpacing,
        barSpacing,
        barHeight,
        categories,
        chartTitleSection,
        groups,
        bars,
      },
      null,
      2
    ); // Convert object to formatted JSON string
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `settings.json`; // Set the download filename
    document.body.appendChild(a); // Append to body (required for Firefox)
    a.click(); // Programmatically click the anchor to trigger download
    document.body.removeChild(a); // Clean up the anchor element
    URL.revokeObjectURL(url); // Release the object URL
  };

  const maxValue = useMemo(
    () => Math.max(...bars.map((bar) => bar.value.value), 1),
    [bars]
  );

  const groupedBars = useMemo(() => {
    return groups.map((group) => ({
      group,
      bars: bars.filter((bar) => bar.groupId === group.id),
    }));
  }, [groups, bars]);

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      itemId: null,
      position: { x: 0, y: 0 },
    });
  };

  const openModal = (
    type: "bar" | "group" | "titleSection" | "chart" | "legend",
    event: React.MouseEvent,
    itemId?: string
  ) => {
    event.stopPropagation();

    // Get the chart container's bounding rect
    const chartRect = chartRef.current?.getBoundingClientRect();
    if (!chartRect) return;

    // Calculate position relative to the chart container
    const x = event.clientX;
    const y = event.clientY;

    setModalState({
      isOpen: true,
      type,
      itemId,
      position: { x, y },
    });
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (modalState.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [modalState.isOpen]);

  const addGroup = () => {
    const newGroup: ChartGroup = {
      id: Date.now().toString(),
      titleDescription: {
        label: {
          value: `Group ${groups.length + 1}`,
          color: "#000000",
          fontSize: 16,
        },
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
      },
      backgroundColor: { r: 249, g: 250, b: 255, a: 0.4 },
      collapsed: false,
    };
    setGroups([...groups, newGroup]);
  };

  const removeGroup = (groupId: string) => {
    // Move bars from deleted group to first remaining group or create default group
    const remainingGroups = groups.filter((g) => g.id !== groupId);
    let targetGroupId: string;

    if (remainingGroups.length === 0) {
      // Create a default group if no groups remain
      const defaultGroup: ChartGroup = {
        id: "default",
        titleDescription: {
          label: { value: "Default Group", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 0.4 },
        collapsed: false,
      };
      setGroups([defaultGroup]);
      targetGroupId = "default";
    } else {
      setGroups(remainingGroups);
      targetGroupId = remainingGroups[0].id;
    }

    // Reassign bars from deleted group
    setBars(
      bars.map((bar) =>
        bar.groupId === groupId ? { ...bar, groupId: targetGroupId } : bar
      )
    );

    closeModal();
  };

  const updateGroup = (groupId: string, updates: Partial<ChartGroup>) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, ...updates } : group
      )
    );
  };

  const updateAllGroup = (updates: ChartGroup) => {
    setGroups(
      groups.map((group) => {
        return {
          ...group,
          titleDescription: {
            ...updates.titleDescription,
            padding: {
              ...updates.titleDescription.padding,
              top: updates.titleDescription.padding.top,
              bottom: updates.titleDescription.padding.bottom,
              left: updates.titleDescription.padding.left,
              right: updates.titleDescription.padding.right,
            },
          },
        };
      })
    );
  };

  const toggleGroupCollapse = (groupId: string) => {
    updateGroup(groupId, {
      collapsed: !groups.find((g) => g.id === groupId)?.collapsed,
    });
  };

  const updateCategory = (
    categoryId: string,
    updates: Partial<ChartCategory>
  ) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId ? { ...category, ...updates } : category
      )
    );

    // Update all bars with this category to use the new color
    if (updates.color) {
      setBars(
        bars.map((bar) =>
          bar.categoryId === categoryId ? { ...bar, color: updates.color } : bar
        )
      );
    }
  };

  const addCategory = () => {
    const newCategory: ChartCategory = {
      id: Date.now().toString(),
      label: `Category ${categories.length + 1}`,
      color: { r: 139, g: 92, b: 246, a: 1 },
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (categoryId: string) => {
    //if (categories.length === 1) return; // Keep at least one category
    const remainingCategories = categories.filter((c) => c.id !== categoryId);

    setCategories(remainingCategories);

    if (remainingCategories.length > 0) {
      const targetCategoryId = remainingCategories[0].id;

      setBars(
        bars.map((bar) =>
          bar.categoryId === categoryId
            ? {
                ...bar,
                categoryId: targetCategoryId,
                color: remainingCategories[0].color,
              }
            : bar
        )
      );
    } else {
      setBars(
        bars.map((bar) =>
          bar.categoryId === categoryId
            ? {
                ...bar,
                categoryId: undefined,
                color: bar.foreGroundColor,
              }
            : bar
        )
      );
    }
  };

  const addBar = (groupId?: string) => {
    const targetGroupId = groupId || groups[0]?.id || "default";
    const group = groups.find((g) => g.id === targetGroupId);
    const newBar: ChartBar = {
      id: Date.now().toString(),
      titleDescription: {
        label: {
          value: `Item ${bars.length + 1}`,
          color: "#000000",
          fontSize: 16,
        },
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
      },
      value: {
        value: 100,
        color: "#000000",
        fontSize: 16,
      },
      backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
      foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
      groupId: targetGroupId,
    };
    setBars([...bars, newBar]);
  };

  const removeBar = (id: string) => {
    setBars(bars.filter((bar) => bar.id !== id));
    closeModal();
  };

  const updateBar = (id: string, updates: Partial<ChartBar>) => {
    setBars(bars.map((bar) => (bar.id === id ? { ...bar, ...updates } : bar)));
  };

  const updateAllBar = (updates: ChartBar) => {
    setBars(
      bars.map((bar) => {
        return {
          ...bar,
          titleDescription: {
            ...updates.titleDescription,
            padding: {
              ...updates.titleDescription.padding,
              top: updates.titleDescription.padding.top,
              bottom: updates.titleDescription.padding.bottom,
              left: updates.titleDescription.padding.left,
              right: updates.titleDescription.padding.right,
            },
          },
        };
      })
    );
  };

  const duplicateBar = (id: string) => {
    const barToDuplicate = bars.find((bar) => bar.id === id);
    if (barToDuplicate) {
      const newBar: ChartBar = {
        ...barToDuplicate,
        id: Date.now().toString(),
        titleDescription: {
          ...barToDuplicate.titleDescription,
          label: {
            ...barToDuplicate.titleDescription.label,
            value: `${barToDuplicate.titleDescription.label.value} Copy`,
          },
        },
      };
      setBars([...bars, newBar]);
    }
  };

  const loadTemplate = (template: ChartTemplate) => {
    setChartBackgroundHeight(template.background.height);
    setChartBackgroundWidth(template.background.width);
    setGroups(template.groups);
    setBars(template.bars);
    setChartType(template.chartType);
    setChartTitleSection(template.chartTitleSection);
    setChartWidth(template.width);
    setBarSpacing(template.barSpacing);
    setGroupSpacing(template.groupSpacing);
    setSettings(template.settings);
    setCategories(template.categories);
    closeModal();
  };

  const resetChart = () => {
    setCategories([]);
    setGroups([
      {
        id: "group1",
        titleDescription: {
          label: { value: "Group A", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
        },
        backgroundColor: { r: 139, g: 92, b: 246, a: 0.2 },
        collapsed: false,
      },
      {
        id: "group2",
        titleDescription: {
          label: { value: "Group B", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
        },
        backgroundColor: { r: 139, g: 92, b: 246, a: 0.2 },
        collapsed: false,
      },
    ]);
    setBars([
      {
        id: "1",
        titleDescription: {
          label: { value: "Item 1", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },

        value: {
          value: 400,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },

        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "group1",
      },
      {
        id: "2",
        titleDescription: {
          label: { value: "Item 2", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        value: {
          value: 300,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "group1",
      },
      {
        id: "3",
        titleDescription: {
          label: { value: "Item 3", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        value: {
          value: 500,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "group2",
      },
      {
        id: "4",
        titleDescription: {
          label: { value: "Item 4", color: "#000000", fontSize: 16 },
          description: { value: "test", color: "#000000", fontSize: 16 },
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          },
          gap: 5,
        },
        value: {
          value: 200,
          color: "#000000",
          fontSize: 16,
          postfix: "",
          prefix: "",
        },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "group2",
      },
    ]);
    setChartTitleSection({
      label: {
        value: "Chart",
        color: "#000000",
        fontSize: 16,
      },
      description: {
        value: "Description",
        color: "#000000",
        fontSize: 14,
      },
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
      gap: 5,
    });
    setChartWidth(1000);
    setBarSpacing(10);
    setGroupSpacing(15);
    closeModal();
  };

  const currentBar = modalState.itemId
    ? bars.find((bar) => bar.id === modalState.itemId)
    : null;
  const currentGroup = modalState.itemId
    ? groups.find((group) => group.id === modalState.itemId)
    : null;

  const renderEditModal = () => {
    if (!modalState.isOpen) return null;

    const adjustedPosition = {
      x: Math.min(Math.max(modalState.position.x, 10), window.innerWidth - 320),
      y: Math.min(
        Math.max(modalState.position.y, 10),
        window.innerHeight - 400
      ),
    };

    if (modalState.type === "bar" && currentBar) {
      return (
        <div
          ref={modalRef}
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-72 h-150 overflow-auto"
          style={{
            left: `${adjustedPosition.x}px`,
            top: `${adjustedPosition.y}px`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: `rgba(${currentBar.foreGroundColor.r},${currentBar.foreGroundColor.g},${currentBar.foreGroundColor.b},${currentBar.foreGroundColor.a})`,
                }}
              />
              <h3 className="font-semibold text-gray-900">Edit Bar</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeModal}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Label</Label>
              <Input
                value={currentBar.titleDescription.label.value}
                onChange={(e) =>
                  updateBar(currentBar.id, {
                    ...currentBar,
                    titleDescription: {
                      ...currentBar.titleDescription,
                      label: {
                        ...currentBar.titleDescription.label,
                        value: e.target.value,
                      },
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Bar label"
              />
            </div>

            <FontPicker
              setFont={setBarLabelFont}
              fontSelection={barLabelFont}
              mainLabel="Bar Label Font"
              variantLabel="Bar Label Font Variant"
            />

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Bar Label Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentBar?.titleDescription.label?.color}
                  onChange={(e) =>
                    updateBar(currentBar.id, {
                      ...currentBar,
                      titleDescription: {
                        ...currentBar.titleDescription,
                        label: {
                          ...currentBar.titleDescription.label,
                          color: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-12 h-8 p-1 border rounded"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Label Font Size
              </Label>
              <Input
                type="number"
                value={settings.bar.labelFontSize}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bar: {
                      ...settings.bar,
                      labelFontSize: parseInt(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="14"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Label inside bar
              </Label>
              <Input
                type="checkbox"
                checked={settings.bar.labelInside}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bar: {
                      ...settings.bar,
                      labelInside: e.target.checked,
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Bar label"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Description
              </Label>
              <Input
                value={currentBar.titleDescription.description?.value}
                onChange={(e) =>
                  updateBar(currentBar.id, {
                    ...currentBar,
                    titleDescription: {
                      ...currentBar.titleDescription,
                      description: {
                        value: e.target.value,
                        color:
                          currentBar?.titleDescription?.description?.color ??
                          "#000000",
                        fontSize:
                          currentBar?.titleDescription?.description?.fontSize ??
                          14,
                      },
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Bar label"
              />
            </div>

            <FontPicker
              setFont={setBarDescriptionFont}
              fontSelection={barDescriptionFont}
              mainLabel="Bar Description Font"
              variantLabel="Bar Description Font Variant"
            />

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Bar Deescription Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentBar.titleDescription?.description?.color}
                  onChange={(e) =>
                    updateBar(currentBar.id, {
                      ...currentBar,
                      titleDescription: {
                        ...currentBar.titleDescription,
                        description: {
                          value:
                            currentBar?.titleDescription?.description?.value ??
                            "",
                          color: e.target.value ?? "#000000",
                          fontSize:
                            currentBar?.titleDescription?.description
                              ?.fontSize ?? 14,
                        },
                      },
                    })
                  }
                  className="w-12 h-8 p-1 border rounded"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Description Font Size
              </Label>
              <Input
                type="number"
                value={settings.bar.descriptionFontSize}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bar: {
                      ...settings.bar,
                      descriptionFontSize: parseInt(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="14"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Title Description Padding left
              </Label>
              <Input
                type="number"
                value={currentBar.titleDescription.padding.left}
                onChange={(e) =>
                  updateAllBar({
                    ...currentBar,
                    titleDescription: {
                      ...currentBar.titleDescription,
                      padding: {
                        ...currentBar.titleDescription.padding,
                        left: parseInt(e.target.value),
                      },
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Title Description Padding right
              </Label>
              <Input
                type="number"
                value={currentBar.titleDescription.padding.right}
                onChange={(e) =>
                  updateAllBar({
                    ...currentBar,
                    titleDescription: {
                      ...currentBar.titleDescription,
                      padding: {
                        ...currentBar.titleDescription.padding,
                        right: parseInt(e.target.value),
                      },
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Title Description Gap
              </Label>
              <Input
                type="number"
                value={currentBar.titleDescription.gap}
                onChange={(e) =>
                  updateAllBar({
                    ...currentBar,
                    titleDescription: {
                      ...currentBar.titleDescription,
                      gap: parseInt(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="5"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Value</Label>
              <Input
                type="number"
                value={currentBar.value.value}
                onChange={(e) =>
                  updateBar(currentBar.id, {
                    ...currentBar,
                    value: {
                      ...currentBar.value,
                      value: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Bar value"
              />
            </div>

            <FontPicker
              setFont={setBarValueFont}
              fontSelection={barValueFont}
              mainLabel="Bar Value Font"
              variantLabel="Bar Value Font Variant"
            />

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Value Prefix
              </Label>
              <Input
                type="text"
                value={currentBar.value.prefix}
                onChange={(e) =>
                  updateBar(currentBar.id, {
                    ...currentBar,
                    value: {
                      ...currentBar.value,
                      prefix: e?.target?.value || "",
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Bar Prefix"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Value Postfix
              </Label>
              <Input
                type="text"
                value={currentBar.value.postfix}
                onChange={(e) =>
                  updateBar(currentBar.id, {
                    ...currentBar,
                    value: {
                      ...currentBar.value,
                      postfix: e?.target?.value || "",
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Bar Postfix"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Value Position
              </Label>
              <select
                value={settings.bar.valuePosition}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bar: {
                      ...settings.bar,
                      valuePosition: e.target.value as BarValuePositionKeys,
                    },
                  })
                }
                className="flex-1 h-8 text-sm border border-input bg-background px-3 py-1 rounded-md w-full"
              >
                {barValuePositions.map((barPosition) => (
                  <option key={barPosition.key} value={barPosition.key}>
                    {barPosition.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Value Font Size
              </Label>
              <Input
                type="number"
                value={settings.bar.valueFontSize}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bar: {
                      ...settings.bar,
                      valueFontSize: parseInt(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="14"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Bar Value Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentBar?.value?.color}
                  onChange={(e) =>
                    updateBar(currentBar.id, {
                      ...currentBar,
                      value: {
                        color: e.target.value ?? "#000000",
                        fontSize: currentBar.value?.fontSize ?? 14,
                        value: currentBar.value.value,
                      },
                    })
                  }
                  className="w-12 h-8 p-1 border rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Label Width
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={settings.bar.labelWidth}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bar: {
                        ...settings.bar,
                        labelWidth: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full h-8 p-1 border rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Category
              </Label>
              <select
                value={currentBar?.categoryId}
                onChange={(e) => {
                  const selectedCategory = categories.find(
                    (cat) => cat.id === e.target.value
                  );
                  updateBar(currentBar.id, {
                    categoryId: e.target.value,
                    foreGroundColor:
                      selectedCategory?.color || currentBar.foreGroundColor,
                  });
                }}
                className="h-8 text-sm border border-input bg-background px-3 py-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">None</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Rounded Corners
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={settings.bar.roundedCorners}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bar: {
                        ...settings.bar,
                        roundedCorners: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full h-8 p-1 border rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Background Color
              </Label>
              <div className="flex gap-2">
                <PopoverPicker
                  color={currentBar.backgroundColor}
                  onChange={(e) => {
                    updateBar(currentBar.id, {
                      ...currentBar,
                      backgroundColor: e,
                    });
                  }}
                />
              </div>
            </div>

            {!currentBar.categoryId ? (
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-500">
                  ForeGround Color
                </Label>
                <div className="flex gap-2">
                  <PopoverPicker
                    color={currentBar.foreGroundColor}
                    onChange={(e) => {
                      updateBar(currentBar.id, {
                        ...currentBar,
                        foreGroundColor: e,
                      });
                    }}
                  />
                </div>
              </div>
            ) : null}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => duplicateBar(currentBar.id)}
                className="flex-1 h-8 text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                Duplicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeBar(currentBar.id)}
                className="h-8 text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (modalState.type === "group" && currentGroup) {
      const groupBars = bars.filter((b) => b.groupId === currentGroup.id);
      const groupTotal = groupBars.reduce(
        (sum, bar) => sum + bar.value.value,
        0
      );

      return (
        <div
          ref={modalRef}
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-72 h-150 overflow-auto"
          style={{
            left: `${adjustedPosition.x}px`,
            top: `${adjustedPosition.y}px`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: `rgba(${currentGroup.backgroundColor.r},${currentGroup.backgroundColor.g},${currentGroup.backgroundColor.b},${currentGroup.backgroundColor.a})`,
                }}
              />
              <h3 className="font-semibold text-gray-900">Edit Group</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeModal}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Name
              </Label>
              <Input
                value={currentGroup.titleDescription.label.value}
                onChange={(e) =>
                  updateGroup(currentGroup.id, {
                    ...currentGroup,
                    titleDescription: {
                      ...currentGroup.titleDescription,
                      label: {
                        ...currentGroup.titleDescription.label,
                        value: e.target.value,
                      },
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Group name"
              />
            </div>

            <FontPicker
              setFont={setGroupNameFont}
              fontSelection={groupNameFont}
              mainLabel="Group Name Font"
              variantLabel="Group Name Font Variant"
            />

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Label Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentGroup.titleDescription.label.color}
                  onChange={(e) =>
                    updateGroup(currentGroup.id, {
                      ...currentGroup,
                      titleDescription: {
                        ...currentGroup.titleDescription,
                        label: {
                          ...currentGroup.titleDescription.label,
                          color: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-12 h-8 p-1 border rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Name Font Size
              </Label>
              <Input
                type="number"
                value={settings.group.labelFontSize}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    group: {
                      ...settings.group,
                      labelFontSize: parseInt(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="14"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Description
              </Label>
              <Input
                value={currentGroup.titleDescription?.description?.value ?? ""}
                onChange={(e) =>
                  updateGroup(currentGroup.id, {
                    ...currentGroup,
                    titleDescription: {
                      ...currentGroup.titleDescription,
                      description: {
                        value: e.target.value,
                        color:
                          currentGroup.titleDescription?.description?.color ??
                          "#000000",
                        fontSize:
                          currentGroup.titleDescription?.description
                            ?.fontSize ?? 14,
                      },
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Group name"
              />
            </div>

            <FontPicker
              setFont={setGroupDescriptionFont}
              fontSelection={groupDescriptionFont}
              mainLabel="Group Description Font"
              variantLabel="Group Description Font Variant"
            />

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Description Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentGroup?.titleDescription?.description?.color}
                  onChange={(e) =>
                    updateGroup(currentGroup.id, {
                      ...currentGroup,
                      titleDescription: {
                        ...currentGroup.titleDescription,
                        description: {
                          value:
                            currentGroup?.titleDescription?.description
                              ?.value ?? "",
                          color: e.target.value,
                          fontSize:
                            currentGroup.titleDescription?.description
                              ?.fontSize ?? 14,
                        },
                      },
                    })
                  }
                  className="w-12 h-8 p-1 border rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Description Font Size
              </Label>
              <Input
                type="number"
                value={settings.group.descriptionFontSize}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    group: {
                      ...settings.group,
                      descriptionFontSize: parseInt(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="14"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Label position
              </Label>
              <select
                value={settings.group.labelPosition}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    group: {
                      ...settings.group,
                      labelPosition: e.target.value as GroupLabelPositionKeys,
                    },
                  })
                }
                className="flex-1 h-8 text-sm border border-input bg-background px-3 py-1 rounded-md w-full"
              >
                {GroupLabelPositions.map((groupPositions) => (
                  <option key={groupPositions.key} value={groupPositions.key}>
                    {groupPositions.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Rounded Corners
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={settings.group.roundedCorners}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      group: {
                        ...settings.group,
                        roundedCorners: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full h-8 p-1 border rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group title description Gap
              </Label>
              <Input
                type="number"
                value={currentGroup.titleDescription.gap}
                onChange={(e) => {
                  updateAllGroup({
                    ...currentGroup,
                    titleDescription: {
                      ...currentGroup.titleDescription,
                      gap: parseInt(e.target.value),
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group title description padding top
              </Label>
              <Input
                type="number"
                value={currentGroup.titleDescription.padding.top}
                onChange={(e) => {
                  updateAllGroup({
                    ...currentGroup,
                    titleDescription: {
                      ...currentGroup.titleDescription,
                      padding: {
                        ...currentGroup.titleDescription.padding,
                        top: parseInt(e.target.value),
                      },
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group title description padding right
              </Label>
              <Input
                type="number"
                value={currentGroup.titleDescription.padding.right}
                onChange={(e) => {
                  updateAllGroup({
                    ...currentGroup,
                    titleDescription: {
                      ...currentGroup.titleDescription,
                      padding: {
                        ...currentGroup.titleDescription.padding,
                        right: parseInt(e.target.value),
                      },
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group title description padding bottom
              </Label>
              <Input
                type="number"
                value={currentGroup.titleDescription.padding.bottom}
                onChange={(e) => {
                  updateAllGroup({
                    ...currentGroup,
                    titleDescription: {
                      ...currentGroup.titleDescription,
                      padding: {
                        ...currentGroup.titleDescription.padding,
                        bottom: parseInt(e.target.value),
                      },
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group title description padding left
              </Label>
              <Input
                type="number"
                value={currentGroup.titleDescription.padding.left}
                onChange={(e) => {
                  updateAllGroup({
                    ...currentGroup,
                    titleDescription: {
                      ...currentGroup.titleDescription,
                      padding: {
                        ...currentGroup.titleDescription.padding,
                        left: parseInt(e.target.value),
                      },
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Padding Top
              </Label>
              <Input
                type="number"
                value={settings.group.padding.top}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    group: {
                      ...settings.group,
                      padding: {
                        ...settings.group.padding,
                        top: parseInt(e.target.value),
                      },
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Padding Bottom
              </Label>
              <Input
                type="number"
                value={settings.group.padding.bottom}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    group: {
                      ...settings.group,
                      padding: {
                        ...settings.group.padding,
                        bottom: parseInt(e.target.value),
                      },
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Padding Left
              </Label>
              <Input
                type="number"
                value={settings.group.padding.left}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    group: {
                      ...settings.group,
                      padding: {
                        ...settings.group.padding,
                        left: parseInt(e.target.value),
                      },
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Padding Right
              </Label>
              <Input
                type="number"
                value={settings.group.padding.right}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    group: {
                      ...settings.group,
                      padding: {
                        ...settings.group.padding,
                        right: parseInt(e.target.value),
                      },
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Background Color
              </Label>
              <div className="flex gap-2">
                <PopoverPicker
                  color={currentGroup.backgroundColor}
                  onChange={(e) => {
                    updateGroup(currentGroup.id, {
                      ...currentGroup,
                      backgroundColor: e,
                    });
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addBar(currentGroup.id)}
                className="flex-1 h-8 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Bar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeGroup(currentGroup.id)}
                className="h-8 text-xs text-red-600 hover:text-red-700"
                disabled={groups.length === 1}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (modalState.type === "legend") {
      return (
        <div
          ref={modalRef}
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-72 h-150 overflow-auto"
          style={{
            left: `${adjustedPosition.x}px`,
            top: `${adjustedPosition.y}px`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: chartLegend.color }}
              />
              <h3 className="font-semibold text-gray-900">
                Edit Legend Section
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeModal}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Legend Title
              </Label>
              <Input
                value={chartLegend.label}
                onChange={(e) =>
                  setChartLegend({
                    ...chartLegend,
                    label: e.target.value,
                  })
                }
                className="h-8 text-sm"
                placeholder="Legend Title"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Legend Title Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={chartLegend.color}
                  onChange={(e) =>
                    setChartLegend({
                      ...chartLegend,
                      color: e.target.value,
                    })
                  }
                  className="w-12 h-8 p-1 border rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Legend Title Font Size
              </Label>
              <Input
                type="number"
                value={chartLegend.fontSize}
                onChange={(e) =>
                  setChartLegend({
                    ...chartLegend,
                    fontSize: parseInt(e.target.value),
                  })
                }
                className="h-8 text-sm"
                placeholder="Legend Title Font Size"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Legend Title Labels Gap
              </Label>
              <Input
                type="number"
                value={chartLegend.gap}
                onChange={(e) =>
                  setChartLegend({
                    ...chartLegend,
                    gap: parseInt(e.target.value),
                  })
                }
                className="h-8 text-sm"
                placeholder="Legend Title Labels Gap"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Legend Padding Top
              </Label>
              <Input
                type="number"
                value={chartLegend.padding.top}
                onChange={(e) =>
                  setChartLegend({
                    ...chartLegend,
                    padding: {
                      ...chartLegend.padding,
                      top: parseInt(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Legend Padding Top"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Legend Padding Right
              </Label>
              <Input
                type="number"
                value={chartLegend.padding.right}
                onChange={(e) =>
                  setChartLegend({
                    ...chartLegend,
                    padding: {
                      ...chartLegend.padding,
                      right: parseInt(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Legend Padding Right"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Legend Padding Bottom
              </Label>
              <Input
                type="number"
                value={chartLegend.padding.bottom}
                onChange={(e) =>
                  setChartLegend({
                    ...chartLegend,
                    padding: {
                      ...chartLegend.padding,
                      bottom: parseInt(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Legend Padding bottom"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Legend Padding Left
              </Label>
              <Input
                type="number"
                value={chartLegend.padding.left}
                onChange={(e) =>
                  setChartLegend({
                    ...chartLegend,
                    padding: {
                      ...chartLegend.padding,
                      top: parseInt(e.target.value),
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Legend Padding Left"
              />
            </div>
          </div>
        </div>
      );
    }

    if (modalState.type === "titleSection") {
      return (
        <div
          ref={modalRef}
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-72 h-150 overflow-auto"
          style={{
            left: `${adjustedPosition.x}px`,
            top: `${adjustedPosition.y}px`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: chartTitleSection.label.color }}
              />
              <h3 className="font-semibold text-gray-900">
                Edit Title Section
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeModal}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Name
              </Label>
              <Input
                value={chartTitleSection.label.value}
                onChange={(e) =>
                  setChartTitleSection({
                    ...chartTitleSection,
                    label: {
                      ...chartTitleSection.label,
                      value: e.target.value,
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Chart Name"
              />
            </div>

            <FontPicker
              setFont={setChartTitleFont}
              fontSelection={chartTitleFont}
              mainLabel="Chart Name Font"
              variantLabel="Chart Name Font Variant"
            />

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Name Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={chartTitleSection.label.color}
                  onChange={(e) =>
                    setChartTitleSection({
                      ...chartTitleSection,
                      label: {
                        ...chartTitleSection.label,
                        color: e.target.value,
                      },
                    })
                  }
                  className="w-12 h-8 p-1 border rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Title Font Size
              </Label>
              <Input
                type="number"
                value={chartTitleSection.label.fontSize}
                onChange={(e) => {
                  setChartTitleSection({
                    ...chartTitleSection,
                    label: {
                      ...chartTitleSection.label,
                      fontSize: parseInt(e.target.value),
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="Chart Name"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Description
              </Label>
              <Input
                value={chartTitleSection.description?.value}
                onChange={(e) =>
                  setChartTitleSection({
                    ...chartTitleSection,
                    description: {
                      value: e.target.value,
                      color: chartTitleSection.description?.color ?? "#000000",
                      fontSize: chartTitleSection.description?.fontSize ?? 14,
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Chart Description"
              />
            </div>

            <FontPicker
              setFont={setChartDescriptionFont}
              fontSelection={chartDescriptionFont}
              mainLabel="Chart Description Font"
              variantLabel="Chart Description Font Variant"
            />

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Description Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={chartTitleSection.description?.color}
                  onChange={(e) =>
                    setChartTitleSection({
                      ...chartTitleSection,
                      description: {
                        value: chartTitleSection.description?.value ?? "",
                        color: e.target.value,
                        fontSize: chartTitleSection.description?.fontSize ?? 14,
                      },
                    })
                  }
                  className="w-12 h-8 p-1 border rounded"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Description Font Size
              </Label>
              <Input
                type="number"
                value={chartTitleSection.description?.fontSize}
                onChange={(e) => {
                  setChartTitleSection({
                    ...chartTitleSection,
                    description: {
                      value: chartTitleSection.description?.value ?? "",
                      color: chartTitleSection.description?.color ?? "#000000",
                      fontSize: parseInt(e.target.value),
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="Chart Name"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Gap</Label>
              <Input
                type="number"
                value={chartTitleSection.gap}
                onChange={(e) => {
                  setChartTitleSection({
                    ...chartTitleSection,
                    gap: parseInt(e.target.value),
                  });
                }}
                className="h-8 text-sm"
                placeholder="Chart Name"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Padding Top
              </Label>
              <Input
                type="number"
                value={chartTitleSection.padding.top}
                onChange={(e) => {
                  setChartTitleSection({
                    ...chartTitleSection,
                    padding: {
                      ...chartTitleSection.padding,
                      top: parseInt(e.target.value),
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="Chart Name"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Padding Bottom
              </Label>
              <Input
                type="number"
                value={chartTitleSection.padding.bottom}
                onChange={(e) => {
                  setChartTitleSection({
                    ...chartTitleSection,
                    padding: {
                      ...chartTitleSection.padding,
                      bottom: parseInt(e.target.value),
                    },
                  });
                }}
                className="h-8 text-sm"
                placeholder="Chart Name"
              />
            </div>
          </div>
        </div>
      );
    }

    if (modalState.type === "chart") {
      return (
        <div
          ref={modalRef}
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-72 h-150 overflow-auto"
          style={{
            left: `${adjustedPosition.x}px`,
            top: `${adjustedPosition.y}px`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: `rgba(${chartBackgroundColor})` }}
              />
              <h3 className="font-semibold text-gray-900">Edit Chart</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeModal}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <FontPicker
            setFont={setChartFont}
            fontSelection={chartFont}
            mainLabel="Chart Font"
            variantLabel="Chart Variant"
          />

          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-500">
              Chart Width
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={chartWidth}
                onChange={(e) => setChartWidth(parseInt(e.target.value))}
                className="w-full h-8 p-1 border rounded"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Background Color
              </Label>
              <PopoverPicker
                color={chartBackgroundColor}
                onChange={(e) => {
                  setChartBackgroundColor(e);
                }}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Background Width
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={chartBackgroundWidth}
                  onChange={(e) =>
                    setChartBackgroundWidth(parseInt(e.target.value))
                  }
                  className="w-full h-8 p-1 border rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Background Height
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={chartBackgroundHeight}
                  onChange={(e) =>
                    setChartBackgroundHeight(parseInt(e.target.value))
                  }
                  className="w-full h-8 p-1 border rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Bar Height
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={barHeight}
                  onChange={(e) => setBarHeight(parseInt(e.target.value))}
                  className="w-full h-8 p-1 border rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Bar Spacing
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={barSpacing}
                  onChange={(e) => setBarSpacing(parseInt(e.target.value))}
                  className="w-full h-8 p-1 border rounded"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Bar Sort Order
              </Label>
              <select
                value={settings.sort}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    sort: e.target.value as Sort,
                  })
                }
                className="flex-1 h-8 text-sm border border-input bg-background px-3 py-1 rounded-md w-full"
              >
                {SortOrder.map((order) => (
                  <option key={order.key} value={order.key}>
                    {order.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 grid grid-cols-2">
              <div>
                <Label className="text-xs font-medium text-gray-500">
                  Hide X Axis
                </Label>
                <Input
                  type="checkbox"
                  checked={settings.hideXAxis}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hideXAxis: e.target.checked,
                    })
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-500">
                  Hide Y Axis
                </Label>
                <Input
                  type="checkbox"
                  checked={settings.hideYAxis}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hideYAxis: e.target.checked,
                    })
                  }
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Spacing
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={groupSpacing}
                  onChange={(e) => setGroupSpacing(parseInt(e.target.value))}
                  className="w-full h-8 p-1 border rounded"
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addGroup()}
              className="flex-1 h-8 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Group
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderHorizontalChart = () => {
    const legendHeight =
      categories.length > 0
        ? chartLegend.fontSize +
          chartLegend.gap +
          chartLegend.padding.top +
          chartLegend.padding.bottom +
          14 + //category Item font size
          10 //extra buffer
        : 0;
    const labelWidth = settings.bar.labelWidth;
    const padding = { top: 20, right: 20, bottom: 20, left: labelWidth + 20 };
    let groupLabelHeight = settings.group.labelFontSize;
    let groupDescriptionHeight = settings?.group?.descriptionFontSize
      ? settings?.group?.descriptionFontSize
      : 0;

    const ignoreLabelHeight =
      settings.group.labelPosition === "replaceBarLabels";
    if (ignoreLabelHeight) {
      groupLabelHeight = 0;
      groupDescriptionHeight = 0;
    }

    const totalGroupBarHeight = groupedBars.reduce(
      (sum, group, groupIndex) =>
        sum +
        barSpacing * (group.bars.length - 1) +
        barHeight * group.bars.length +
        (groupIndex === groupedBars.length - 1 ? 0 : groupSpacing) +
        groupLabelHeight +
        groupDescriptionHeight +
        (!ignoreLabelHeight ? group.group.titleDescription.padding.top : 0) +
        (!ignoreLabelHeight ? group.group.titleDescription.padding.bottom : 0) +
        (!ignoreLabelHeight ? group.group.titleDescription.gap ?? 0 : 0) +
        settings.group.padding.top +
        settings.group.padding.bottom,
      0
    );

    const chartHeight =
      totalGroupBarHeight +
      chartTitleSection.label.fontSize +
      (chartTitleSection.description?.fontSize ?? 0) +
      (chartTitleSection.gap ?? 0) +
      chartTitleSection.padding.top +
      chartTitleSection.padding.bottom +
      legendHeight;

    const availableWidth =
      chartWidth -
      settings.group.padding.left -
      settings.group.padding.right -
      labelWidth;

    let currentY =
      chartTitleSection.label.fontSize +
      (chartTitleSection.description?.fontSize ?? 0) +
      (chartTitleSection.gap ?? 0) +
      chartTitleSection.padding.top +
      chartTitleSection.padding.bottom;

    return (
      <svg
        preserveAspectRatio="xMidYMid meet"
        ref={svgRef}
        width={chartBackgroundWidth}
        height={chartHeight}
        viewBox={`0 0 ${chartBackgroundWidth} ${chartHeight}`}
        className="border rounded-lg bg-white cursor-pointer"
        onClick={(e) => openModal("chart", e)}
        style={{
          width: "100%",
          maxWidth: "100vw",
          height: "auto",
          display: "block",
        }}
      >
        <defs>
          <style>{`
            @font-face {
              font-family: 'ChartTitleFont';
              src: url(${chartTitleFont?.ttf ?? ""}) format('truetype');
            }
            @font-face {
              font-family: 'ChartDescriptionFont';
              src: url(${chartDescriptionFont?.ttf ?? ""}) format('truetype');
            }
            @font-face {
              font-family: 'MyFont';
              src: url(${chartFont?.ttf ?? ""}) format('truetype');
            }
            @font-face {
              font-family: 'GroupNameFont';
              src: url(${groupNameFont?.ttf ?? ""}) format('truetype');
            }
            @font-face {
              font-family: 'GroupDescriptionFont';
              src: url(${groupDescriptionFont?.ttf ?? ""}) format('truetype');
            }
            @font-face {
              font-family: 'BarLabelFont';
              src: url(${barLabelFont?.ttf ?? ""}) format('truetype');
            }
            @font-face {
              font-family: 'BarDescriptionFont';
              src: url(${barDescriptionFont?.ttf ?? ""}) format('truetype');
            }
            @font-face {
              font-family: 'BarValueFont';
              src: url(${barValueFont?.ttf ?? ""}) format('truetype');
            }
          `}</style>
        </defs>

        {/* url(#grid) */}
        <rect
          width={"100%"}
          height={"100%"}
          fill={`rgba(${chartBackgroundColor.r},${chartBackgroundColor.g},${chartBackgroundColor.b},${chartBackgroundColor.a})`}
        />

        <g
          transform={`translate(${chartBackgroundWidth / 2 - chartWidth / 2}, ${
            chartHeight / 2 - chartHeight / 2
          })`}
        >
          {/* Chart Title */}
          <text
            x={chartWidth / 2}
            y={chartTitleSection.padding.top + chartTitleSection.label.fontSize}
            textAnchor="middle"
            fill={chartTitleSection.label.color}
            style={{ fontFamily: "ChartTitleFont, MyFont" }}
            fontSize={chartTitleSection.label.fontSize}
            onClick={(e) => openModal("titleSection", e)}
          >
            {chartTitleSection.label.value}
          </text>
          <text
            x={chartWidth / 2}
            y={
              (chartTitleSection.description?.fontSize ?? 0) +
              chartTitleSection.label.fontSize +
              (chartTitleSection.gap ?? 0) +
              chartTitleSection.padding.top
            }
            textAnchor="middle"
            fill={chartTitleSection.description?.color}
            style={{ fontFamily: "ChartDescriptionFont, MyFont" }}
            fontSize={chartTitleSection.description?.fontSize ?? 0}
            onClick={(e) => openModal("titleSection", e)}
          >
            {chartTitleSection.description?.value ?? ""}
          </text>

          {settings.hideYAxis ? null : (
            <>
              {/* Y-axis line */}
              <line
                x1={padding.left}
                y1={currentY - 20}
                x2={padding.left}
                y2={chartHeight}
                stroke="#e2e8f0"
                strokeWidth="2"
              />
            </>
          )}

          {settings.hideXAxis ? null : (
            <>
              {/* X-axis line */}
              <line
                x1={padding.left}
                y1={chartHeight}
                x2={chartWidth - padding.right}
                y2={chartHeight}
                stroke="#e2e8f0"
                strokeWidth="2"
              />
              {/* X-axis scale markers */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const x = padding.left + ratio * availableWidth;
                const value = Math.round(ratio * maxValue);
                return (
                  <g key={ratio}>
                    <line
                      x1={x}
                      y1={chartHeight}
                      x2={x}
                      y2={chartHeight + 5}
                      stroke="#94a3b8"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={chartHeight + 18}
                      textAnchor="middle"
                      style={{ fontFamily: "MyFont" }}
                    >
                      {value.toLocaleString()}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* Render Groups and Bars */}
          {groupedBars.map((groupData, groupIndex) => {
            const { group, bars: groupBars } = groupData;

            if (settings.sort !== "none") {
              groupBars.sort((a, b) =>
                settings.sort === "asc"
                  ? a.value.value - b.value.value
                  : b.value.value - a.value.value
              );
            }

            const groupTitleDescriptionSectionPaddingTop = ignoreLabelHeight
              ? 0
              : group.titleDescription.padding.top;
            const groupTitleDescriptionSectionGap = ignoreLabelHeight
              ? 0
              : group.titleDescription?.gap ?? 0;
            const groupTitleDescriptionSectionPaddingBottom = ignoreLabelHeight
              ? 0
              : group.titleDescription.padding.bottom;

            // Render expanded group
            const groupStartY = currentY;
            currentY +=
              groupLabelHeight +
              groupDescriptionHeight +
              settings.group.padding.top +
              groupTitleDescriptionSectionPaddingTop +
              groupTitleDescriptionSectionGap +
              groupTitleDescriptionSectionPaddingBottom;

            const spacingHeightCentered =
              (barSpacing * (groupBars.length - 1)) / 2;
            const barHeightCentered = (barHeight * groupBars.length) / 2;

            const groupLabelPosition: Record<
              GroupLabelPositionKeys,
              { x: number; y: number; anchor: string }
            > = {
              left: {
                x:
                  settings.group.padding.left +
                  group.titleDescription.padding.left,
                y:
                  groupStartY +
                  groupTitleDescriptionSectionPaddingTop +
                  settings.group.padding.top +
                  groupLabelHeight / 2,
                anchor: "start",
              },
              center: {
                x: chartWidth / 2,
                y:
                  groupStartY +
                  groupTitleDescriptionSectionPaddingTop +
                  settings.group.padding.top +
                  groupLabelHeight / 2,
                anchor: "middle",
              },
              right: {
                x:
                  labelWidth +
                  availableWidth +
                  settings.group.padding.right -
                  group.titleDescription.padding.right,
                y:
                  groupStartY +
                  groupTitleDescriptionSectionPaddingTop +
                  settings.group.padding.top +
                  groupLabelHeight / 2,
                anchor: "end",
              },
              replaceBarLabels: {
                x:
                  settings.group.padding.left +
                  group.titleDescription.padding.left,
                y:
                  groupStartY +
                  settings.group.padding.top -
                  (group.titleDescription?.gap ?? 0) / 2 -
                  (settings.group.descriptionFontSize ?? 0) / 2 +
                  barHeightCentered +
                  spacingHeightCentered,
                anchor: "start",
              },
            };

            const groupDescriptionPosition: Record<
              GroupLabelPositionKeys,
              { x: number; y: number; anchor: string }
            > = {
              left: {
                x:
                  settings.group.padding.left +
                  group.titleDescription.padding.left,
                y:
                  groupStartY +
                  groupTitleDescriptionSectionPaddingTop +
                  groupTitleDescriptionSectionGap +
                  settings.group.padding.top +
                  groupLabelHeight +
                  groupDescriptionHeight / 2,
                anchor: "start",
              },
              center: {
                x: chartWidth / 2,
                y:
                  groupStartY +
                  groupTitleDescriptionSectionPaddingTop +
                  groupTitleDescriptionSectionGap +
                  settings.group.padding.top +
                  groupLabelHeight +
                  groupDescriptionHeight / 2,
                anchor: "middle",
              },
              right: {
                x:
                  labelWidth +
                  availableWidth +
                  settings.group.padding.right -
                  group.titleDescription.padding.right,
                y:
                  groupStartY +
                  groupTitleDescriptionSectionPaddingTop +
                  groupTitleDescriptionSectionGap +
                  settings.group.padding.top +
                  groupLabelHeight +
                  groupDescriptionHeight / 2,
                anchor: "end",
              },
              replaceBarLabels: {
                x:
                  settings.group.padding.left +
                  group.titleDescription.padding.left,
                y:
                  groupStartY +
                  settings.group.padding.top +
                  (group.titleDescription?.gap ?? 0) / 2 +
                  settings.group.labelFontSize / 2 +
                  barHeightCentered +
                  spacingHeightCentered,
                anchor: "start",
              },
            };

            const groupRegionHeight =
              groupLabelHeight +
              groupDescriptionHeight +
              groupBars.length * barHeight +
              (groupBars.length - 1) * barSpacing +
              settings.group.padding.top +
              settings.group.padding.bottom +
              groupTitleDescriptionSectionPaddingTop +
              groupTitleDescriptionSectionPaddingBottom +
              groupTitleDescriptionSectionGap;

            const groupElements = (
              <g key={group.id}>
                {/* Group background */}
                <rect
                  x={0}
                  y={groupStartY}
                  width={chartWidth}
                  height={groupRegionHeight}
                  fill={`rgba(${group.backgroundColor.r},${group.backgroundColor.g},${group.backgroundColor.b},${group.backgroundColor.a})`}
                  stroke={`rgba(${group.backgroundColor.r},${group.backgroundColor.g},${group.backgroundColor.b},${group.backgroundColor.a})`}
                  strokeWidth="1"
                  rx={settings.group.roundedCorners}
                  ry={settings.group.roundedCorners}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => openModal("group", e, group.id)}
                />

                {/* Group label */}
                <text
                  x={groupLabelPosition[settings.group.labelPosition].x}
                  y={groupLabelPosition[settings.group.labelPosition].y}
                  alignmentBaseline="middle"
                  textAnchor={
                    groupLabelPosition[settings.group.labelPosition].anchor
                  }
                  fill={group.titleDescription.label.color}
                  className="cursor-pointer hover:fill-gray-600"
                  style={{ fontFamily: "GroupNameFont, MyFont" }}
                  fontSize={settings.group.labelFontSize}
                  onClick={(e) => openModal("group", e, group.id)}
                >
                  {/* ▼  */}
                  {group.titleDescription.label.value}
                </text>

                <text
                  x={groupDescriptionPosition[settings.group.labelPosition].x}
                  y={groupDescriptionPosition[settings.group.labelPosition].y}
                  textAnchor={
                    groupDescriptionPosition[settings.group.labelPosition]
                      .anchor
                  }
                  fill={group.titleDescription.description?.color ?? "#000000"}
                  alignmentBaseline="middle"
                  className="cursor-pointer hover:fill-gray-600"
                  style={{ fontFamily: "GroupDescriptionFont, MyFont" }}
                  fontSize={settings.group.descriptionFontSize}
                  onClick={(e) => openModal("group", e, group.id)}
                >
                  {/* ▼  */}
                  {group.titleDescription.description?.value ?? ""}
                </text>

                {/* Group bars */}
                {groupBars.map((bar, barIndex) => {
                  const barWidth =
                    (bar.value.value / maxValue) * availableWidth;
                  const barY = currentY + barIndex * (barHeight + barSpacing);

                  const barValuePosition: Record<
                    BarValuePositionKeys,
                    { position: number; anchor: string }
                  > = {
                    onBackgroundLeft: {
                      position:
                        labelWidth + settings.group.padding.left + barWidth + 8,
                      anchor: "start",
                    },
                    onForegroundRight: {
                      position:
                        barWidth +
                        labelWidth +
                        settings.group.padding.left -
                        10,
                      anchor: "end",
                    },
                    onBackgroundRight: {
                      position: chartWidth - settings.group.padding.right - 10,
                      anchor: "end",
                    },
                    outside: {
                      position: chartWidth + 10,
                      anchor: "start",
                    },
                  };

                  const catColor = categories.find(
                    (x) => x.id === bar.categoryId
                  )?.color;

                  const barColor = bar.categoryId
                    ? `rgba(${catColor?.r},${catColor?.g},${catColor?.b},${catColor?.a})`
                    : `rgba(${bar.foreGroundColor.r},${bar.foreGroundColor.g},${bar.foreGroundColor.b},${bar.foreGroundColor.a})`;

                  return (
                    <g key={bar.id}>
                      {/* Bar background */}
                      <rect
                        x={labelWidth + settings.group.padding.left}
                        y={barY}
                        width={availableWidth}
                        height={barHeight}
                        fill={`rgba(${bar.backgroundColor.r},${bar.backgroundColor.g},${bar.backgroundColor.b},${bar.backgroundColor.a})`}
                        stroke={`rgba(${bar.backgroundColor.r},${bar.backgroundColor.g},${bar.backgroundColor.b},${bar.backgroundColor.a})`}
                        strokeWidth="1"
                        rx={settings.bar.roundedCorners}
                        ry={settings.bar.roundedCorners}
                        onClick={(e) => openModal("bar", e, bar.id)}
                      />

                      {/* Actual Bar */}
                      <rect
                        x={labelWidth + settings.group.padding.left}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        fill={barColor}
                        rx={settings.bar.roundedCorners}
                        ry={settings.bar.roundedCorners}
                        className="cursor-pointer transition-all duration-200 hover:opacity-80 hover:stroke-gray-400"
                        strokeWidth="0"
                        onClick={(e) => openModal("bar", e, bar.id)}
                      />

                      {/* Bar Label */}
                      <text
                        x={
                          settings.bar.labelInside
                            ? labelWidth +
                              settings.group.padding.left +
                              bar.titleDescription.padding.left
                            : labelWidth +
                              settings.group.padding.left -
                              bar.titleDescription.padding.right
                        }
                        y={
                          (settings?.bar.descriptionFontSize ?? 0) === 0
                            ? barY + barHeight / 2
                            : barY -
                              (bar.titleDescription.gap ?? 0) / 2 -
                              (settings?.bar.valueFontSize ?? 0) / 2 +
                              barHeight / 2
                        }
                        textAnchor={settings.bar.labelInside ? "start" : "end"}
                        fill={bar.titleDescription.label.color}
                        alignmentBaseline="middle"
                        className="cursor-pointer hover:fill-gray-900 hover:font-semibold transition-all"
                        style={{ fontFamily: "BarLabelFont,MyFont" }}
                        fontSize={settings.bar.labelFontSize}
                        onClick={(e) => openModal("bar", e, bar.id)}
                      >
                        {bar.titleDescription.label.value}
                      </text>
                      <text
                        x={
                          settings.bar.labelInside
                            ? labelWidth +
                              settings.group.padding.left +
                              bar.titleDescription.padding.left
                            : labelWidth +
                              settings.group.padding.left -
                              bar.titleDescription.padding.right
                        }
                        y={
                          barY +
                          (bar.titleDescription.gap ?? 0) / 2 +
                          (settings?.bar.descriptionFontSize ?? 0) +
                          barHeight / 2
                        }
                        textAnchor={settings.bar.labelInside ? "start" : "end"}
                        fill={
                          bar?.titleDescription?.description?.color ?? "#000000"
                        }
                        alignmentBaseline="middle"
                        className="cursor-pointer hover:fill-gray-900 hover:font-semibold transition-all"
                        style={{ fontFamily: "BarDescriptionFont,MyFont" }}
                        fontSize={settings.bar.descriptionFontSize}
                        onClick={(e) => openModal("bar", e, bar.id)}
                      >
                        {bar.titleDescription?.description?.value}
                      </text>

                      {/* Bar Value */}
                      <text
                        x={
                          barValuePosition[settings.bar.valuePosition].position
                        }
                        y={barY + barHeight / 2}
                        textAnchor={
                          barValuePosition[settings.bar.valuePosition].anchor
                        }
                        fill={bar.value.color}
                        alignmentBaseline="middle"
                        className="cursor-pointer hover:fill-gray-900"
                        style={{ fontFamily: "BarValueFont,MyFont" }}
                        fontSize={settings.bar.valueFontSize}
                        onClick={(e) => openModal("bar", e, bar.id)}
                      >
                        {`${
                          bar?.value?.prefix ?? ""
                        }${bar.value.value.toLocaleString()}${
                          bar?.value?.postfix ?? ""
                        }`}
                      </text>

                      {/* Hover indicator */}
                      <rect
                        x={padding.left - 2}
                        y={barY - 2}
                        width={barWidth + 4}
                        height={barHeight + 4}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="2"
                        rx={settings.bar.roundedCorners}
                        ry={settings.bar.roundedCorners}
                        className="pointer-events-none opacity-0 hover:opacity-100 hover:stroke-blue-400 transition-all"
                      />
                    </g>
                  );
                })}
              </g>
            );

            currentY +=
              groupBars.length * barHeight +
              (groupIndex === groupedBars.length - 1 ? 0 : groupSpacing) +
              (groupBars.length - 1) * barSpacing +
              settings.group.padding.bottom;
            return groupElements;
          })}

          {categories.length > 0 ? (
            <>
              {/* Legend */}
              <g onClick={(e) => openModal("legend", e)}>
                <text
                  x={chartWidth / 2}
                  y={
                    chartHeight -
                    legendHeight +
                    chartLegend.fontSize +
                    chartLegend.padding.top
                  }
                  textAnchor="middle"
                  className=""
                  style={{ fontFamily: "MyFont" }}
                  fill={chartLegend.color}
                  fontSize={chartLegend.fontSize}
                >
                  {chartLegend.label}
                </text>

                {/* Legend Items */}
                {categories.map((category, index) => {
                  const legendItemWidth = 140;
                  const itemsPerRow = Math.floor(
                    labelWidth + chartWidth / legendItemWidth
                  );
                  const totalItems = categories.length;
                  const rows = Math.ceil(totalItems / itemsPerRow);

                  const row = Math.floor(index / itemsPerRow);
                  const col = index % itemsPerRow;

                  // items in this specific row
                  const itemsInRow =
                    row === rows - 1
                      ? totalItems - row * itemsPerRow
                      : itemsPerRow;

                  // recompute startX per row
                  const rowWidth = itemsInRow * legendItemWidth;
                  const startX = (labelWidth + chartWidth - rowWidth) / 2;

                  const x = startX + col * legendItemWidth;
                  const y =
                    chartHeight -
                    legendHeight +
                    chartLegend.padding.top +
                    chartLegend.fontSize +
                    chartLegend.gap +
                    14 +
                    row * 20;

                  return (
                    <g key={category.id}>
                      {/* Legend color swatch */}
                      <rect
                        x={x}
                        y={y - 6}
                        width={12}
                        height={12}
                        fill={`rgba(${category.color?.r},${category.color?.g},${category.color?.b},${category.color?.a})`}
                        rx="2"
                        className=""
                      />

                      {/* Legend label */}
                      <text
                        x={x + 18}
                        y={y}
                        alignmentBaseline="middle"
                        className=""
                      >
                        {category.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </>
          ) : null}
        </g>
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      <div ref={chartRef} className="w-full relative" onClick={closeModal}>
        {renderHorizontalChart()}
      </div>
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Templates
              </CardTitle>
              <CardDescription>
                Quick start with pre-built charts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {defaultTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => loadTemplate(template)}
                >
                  <div className="text-left">
                    <div className="font-medium">
                      {template.chartTitleSection.label.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {template.chartTitleSection.description?.value ?? ""}
                    </div>
                  </div>
                </Button>
              ))}
              <Button variant="outline" className="w-full" onClick={resetChart}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Chart
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleExportSvg}
              >
                <Download className="w-4 h-4 mr-2" />
                Export SVG
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleExportJson}
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Categories
            </CardTitle>
            <CardDescription>
              Manage color categories across groups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                <PopoverPicker
                  color={category.color}
                  onChange={(e) => {
                    updateCategory(category.id, {
                      ...category,
                      color: e,
                    });
                  }}
                />

                <Input
                  value={category.label}
                  onChange={(e) =>
                    updateCategory(category.id, { label: e.target.value })
                  }
                  className="flex-1 h-8 text-sm"
                  aria-label={`Edit label for ${category.label}`}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCategory(category.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <Button
              onClick={addCategory}
              className="w-full"
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Dynamic Edit Modal */}
      {renderEditModal()}
    </div>
  );
};
