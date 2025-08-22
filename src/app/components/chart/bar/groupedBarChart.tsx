import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFont } from "@/app/contexts/fontContext";
import { RgbaColor } from "react-colorful";
import { Button } from "../../ui/button";
import {
  Copy,
  Download,
  Folder,
  FolderOpen,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { PopoverPicker } from "../../colorPicker/popoverPicker";
import { v4 as uuidv4 } from "uuid";

interface ChartBar {
  id: string;
  label: Text;
  value: Value;
  backgroundColor: RgbaColor;
  foreGroundColor: RgbaColor;
  groupId?: string;
}

interface ChartGroup {
  id: string;
  label: Text;
  description?: Text;
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

interface ChartTitleSection {
  name: Text;
  description: Text;
  gap: number;
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

interface Settings {
  barLabelInside: boolean;
  barValuePosition: BarValuePositionKeys;
  barLabelFontSize?: number;
  groupLabelFontSize: number;
  groupDescriptionFontSize?: number;
  barValueFontSize: number;
  xAxisLabelFontSize: number;
  hideXAxis: boolean;
  hideYAxis: boolean;
  labelWidth: number;
  groupLabelPosition: GroupLabelPositionKeys;
}

interface ChartTemplate {
  id: string;
  width: number;
  chartTitleSection: ChartTitleSection;
  background: Background;
  groups: ChartGroup[];
  bars: ChartBar[];
  chartType: "horizontal" | "vertical";
  barSpacing: number;
  groupSpacing: number;
  settings: Settings;
}

interface ModalState {
  isOpen: boolean;
  type: "bar" | "group" | "titleSection" | "chart" | null;
  itemId?: string | null;
  position: { x: number; y: number };
}

const defaultTemplates: ChartTemplate[] = [
  {
    id: "GpuCpu",
    width: 1000,
    chartTitleSection: {
      name: { value: "CPU GPU Compare", color: "#000000", fontSize: 16 },
      description: {
        value: "Compare AMD and Intel",
        color: "#000000",
        fontSize: 14,
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
      barLabelInside: true,
      barValuePosition: "outside",
      barLabelFontSize: 14,
      groupLabelFontSize: 16,
      //groupDescriptionFontSize: 14,
      barValueFontSize: 14,
      xAxisLabelFontSize: 12,
      hideXAxis: true,
      hideYAxis: true,
      labelWidth: 140,
      groupLabelPosition: "replaceBarLabels",
    },
    groups: [
      {
        id: "HighCPU",
        label: { value: "High CPU", color: "#000000", fontSize: 16 },
        backgroundColor: { r: 139, g: 92, b: 246, a: 0.2 },
        collapsed: false,
      },
      {
        id: "HighGPU",
        label: { value: "High GPU", color: "#000000", fontSize: 16 },
        backgroundColor: { r: 139, g: 92, b: 246, a: 0.2 },
        collapsed: false,
      },
      {
        id: "MediumCPU",
        label: { value: "Medium CPU", color: "#000000", fontSize: 16 },
        backgroundColor: { r: 16, g: 185, b: 129, a: 0.2 },
        collapsed: false,
      },
      {
        id: "MediumGPU",
        label: { value: "Medium GPU", color: "#000000", fontSize: 16 },
        backgroundColor: { r: 16, g: 185, b: 129, a: 0.2 },
        collapsed: false,
      },
      {
        id: "LowCPU",
        label: { value: "Low CPU", color: "#000000", fontSize: 16 },
        backgroundColor: { r: 192, g: 132, b: 252, a: 0.2 },
        collapsed: false,
      },
      {
        id: "LowGPU",
        label: { value: "Low GPU", color: "#000000", fontSize: 16 },
        backgroundColor: { r: 192, g: 132, b: 252, a: 0.2 },
        collapsed: false,
      },
    ],
    bars: [
      {
        id: uuidv4(),
        label: { value: "AMD CPU", color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        value: { value: 4500, color: "#000000", fontSize: 16 },
        groupId: "HighCPU",
      },
      {
        id: uuidv4(),
        label: { value: "Intel CPU", color: "#000000", fontSize: 16 },
        value: { value: 4800, color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "HighCPU",
      },
      {
        id: uuidv4(),
        label: { value: "AMD GPU", color: "#000000", fontSize: 16 },
        value: { value: 5200, color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "HighGPU",
      },
      {
        id: uuidv4(),
        label: { value: "Geforce GPU", color: "#000000", fontSize: 16 },
        value: { value: 6100, color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "HighGPU",
      },
      {
        id: uuidv4(),
        label: { value: "AMD CPU", color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        value: { value: 4500, color: "#000000", fontSize: 16 },
        groupId: "MediumCPU",
      },
      {
        id: uuidv4(),
        label: { value: "Intel CPU", color: "#000000", fontSize: 16 },
        value: { value: 4800, color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "MediumCPU",
      },
      {
        id: uuidv4(),
        label: { value: "AMD GPU", color: "#000000", fontSize: 16 },
        value: { value: 5200, color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "MediumGPU",
      },
      {
        id: uuidv4(),
        label: { value: "Geforce GPU", color: "#000000", fontSize: 16 },
        value: { value: 100, color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "MediumGPU",
      },
      {
        id: uuidv4(),
        label: { value: "AMD CPU", color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        value: { value: 4500, color: "#000000", fontSize: 16 },
        groupId: "LowCPU",
      },
      {
        id: uuidv4(),
        label: { value: "Intel CPU", color: "#000000", fontSize: 16 },
        value: { value: 4800, color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "LowCPU",
      },
      {
        id: uuidv4(),
        label: { value: "AMD GPU", color: "#000000", fontSize: 16 },
        value: { value: 5200, color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "LowGPU",
      },
      {
        id: uuidv4(),
        label: { value: "Geforce GPU", color: "#000000", fontSize: 16 },
        value: { value: 6100, color: "#000000", fontSize: 16 },
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

export const GroupedBarChart: React.FC = ({}) => {
  const { font } = useFont();

  const [chartType, setChartType] = useState<"horizontal" | "vertical">(
    "horizontal"
  );
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
    barLabelInside: false,
    barValuePosition: "onBackgroundLeft",
    barLabelFontSize: 14,
    groupLabelFontSize: 16,
    groupDescriptionFontSize: 14,
    barValueFontSize: 14,
    xAxisLabelFontSize: 12,
    hideXAxis: true,
    hideYAxis: true,
    labelWidth: 140,
    groupLabelPosition: "left",
  });

  const [chartTitleSection, setChartTitleSection] = useState<ChartTitleSection>(
    {
      name: {
        value: "Chart",
        color: "#000000",
        fontSize: 16,
      },
      description: {
        value: "Description",
        color: "#000000",
        fontSize: 14,
      },
      gap: 5,
    }
  );
  const [groups, setGroups] = useState<ChartGroup[]>([
    {
      id: "group1",
      label: { value: "Group A", color: "#000000", fontSize: 16 },
      description: { value: "Des", color: "#000000", fontSize: 14 },
      backgroundColor: { r: 139, g: 92, b: 246, a: 0.2 },
      collapsed: false,
    },
    {
      id: "group2",
      label: { value: "Group B", color: "#000000", fontSize: 16 },
      description: { value: "Des", color: "#000000", fontSize: 14 },
      backgroundColor: { r: 139, g: 92, b: 246, a: 0.2 },
      collapsed: false,
    },
  ]);
  const [bars, setBars] = useState<ChartBar[]>([
    {
      id: "1",
      label: { value: "Item 1", color: "#000000", fontSize: 16 },
      value: { value: 400, color: "#000000", fontSize: 16 },
      backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
      foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
      groupId: "group1",
    },
    {
      id: "2",
      label: { value: "Item 2", color: "#000000", fontSize: 16 },
      value: { value: 300, color: "#000000", fontSize: 16 },
      backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
      foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
      groupId: "group1",
    },
    {
      id: "3",
      label: { value: "Item 3", color: "#000000", fontSize: 16 },
      value: { value: 500, color: "#000000", fontSize: 16 },
      backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
      foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
      groupId: "group2",
    },
    {
      id: "4",
      label: { value: "Item 4", color: "#000000", fontSize: 16 },
      value: { value: 200, color: "#000000", fontSize: 16 },
      backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
      foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
      groupId: "group2",
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
    type: "bar" | "group" | "titleSection" | "chart",
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
      label: {
        value: `Group ${groups.length + 1}`,
        color: "#000000",
        fontSize: 16,
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
        label: {
          value: `Default Group`,
          color: "#000000",
          fontSize: 16,
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

  const toggleGroupCollapse = (groupId: string) => {
    updateGroup(groupId, {
      collapsed: !groups.find((g) => g.id === groupId)?.collapsed,
    });
  };

  const addBar = (groupId?: string) => {
    const targetGroupId = groupId || groups[0]?.id || "default";
    const group = groups.find((g) => g.id === targetGroupId);
    const newBar: ChartBar = {
      id: Date.now().toString(),
      label: {
        value: `Item ${bars.length + 1}`,
        color: "#000000",
        fontSize: 16,
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

  const duplicateBar = (id: string) => {
    const barToDuplicate = bars.find((bar) => bar.id === id);
    if (barToDuplicate) {
      const newBar: ChartBar = {
        ...barToDuplicate,
        id: Date.now().toString(),
        label: {
          ...barToDuplicate.label,
          value: `${barToDuplicate.label.value} Copy`,
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
    closeModal();
  };

  const resetChart = () => {
    setGroups([
      {
        id: "group1",
        label: { value: "Group A", color: "#000000", fontSize: 16 },
        backgroundColor: { r: 139, g: 92, b: 246, a: 0.2 },
        collapsed: false,
      },
      {
        id: "group2",
        label: { value: "Group B", color: "#000000", fontSize: 16 },
        backgroundColor: { r: 139, g: 92, b: 246, a: 0.2 },
        collapsed: false,
      },
    ]);
    setBars([
      {
        id: "1",
        label: { value: "Item 1", color: "#000000", fontSize: 16 },
        value: { value: 400, color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "group1",
      },
      {
        id: "2",
        label: { value: "Item 2", color: "#000000", fontSize: 16 },
        value: { value: 300, color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "group1",
      },
      {
        id: "3",
        label: { value: "Item 3", color: "#000000", fontSize: 16 },
        value: { value: 500, color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "group2",
      },
      {
        id: "4",
        label: { value: "Item 4", color: "#000000", fontSize: 16 },
        value: { value: 200, color: "#000000", fontSize: 16 },
        backgroundColor: { r: 249, g: 250, b: 255, a: 1 },
        foreGroundColor: { r: 139, g: 92, b: 246, a: 1 },
        groupId: "group2",
      },
    ]);
    setChartTitleSection({
      name: {
        value: "Chart",
        color: "#000000",
        fontSize: 16,
      },
      description: {
        value: "Description",
        color: "#000000",
        fontSize: 14,
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
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-72"
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
                value={currentBar.label.value}
                onChange={(e) =>
                  updateBar(currentBar.id, {
                    ...currentBar,
                    label: { ...currentBar.label, value: e.target.value },
                  })
                }
                className="h-8 text-sm"
                placeholder="Bar label"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Label Font Size
              </Label>
              <Input
                type="number"
                value={settings.barLabelFontSize}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    barLabelFontSize: parseInt(e.target.value),
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
                checked={settings.barLabelInside}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    barLabelInside: e.target.checked,
                  })
                }
                className="h-8 text-sm"
                placeholder="Bar label"
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

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Value Position
              </Label>
              {/* <Select
                value={settings.barValuePosition}
                onValueChange={(value) => {
                  console.log("here");
                  setSettings({
                    ...settings,
                    barValuePosition: value as BarValuePositionKeys,
                  });
                }}
              >
                <SelectTrigger className="h-8 text-sm z-[100]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {barValuePositions.map((barPosition) => (
                    <SelectItem
                      key={barPosition.key}
                      value={barPosition.key}
                      className="z-[100]"
                    >
                      <div className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs">{barPosition.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
              <select
                value={settings.barValuePosition}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    barValuePosition: e.target.value as BarValuePositionKeys,
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
                value={settings.barValueFontSize}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    barValueFontSize: parseInt(e.target.value),
                  })
                }
                className="h-8 text-sm"
                placeholder="14"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Label Width
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={settings.labelWidth}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      labelWidth: parseInt(e.target.value),
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

            {/* <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Group</Label>
              <Select
                value={currentBar.groupId}
                onValueChange={(value) =>
                  updateBar(currentBar.id, { groupId: value })
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: group.color }}
                        />
                        <span className="text-xs">{group.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

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
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-72"
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
                value={currentGroup.label.value}
                onChange={(e) =>
                  updateGroup(currentGroup.id, {
                    ...currentGroup,
                    label: { ...currentGroup.label, value: e.target.value },
                  })
                }
                className="h-8 text-sm"
                placeholder="Group name"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Name Font Size
              </Label>
              <Input
                type="number"
                value={settings.groupLabelFontSize}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    groupLabelFontSize: parseInt(e.target.value),
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
                value={currentGroup?.description?.value ?? ""}
                onChange={(e) =>
                  updateGroup(currentGroup.id, {
                    ...currentGroup,
                    description: {
                      color: currentGroup.description?.color ?? "#000000",
                      fontSize: currentGroup.description?.fontSize ?? 14,
                      value: e.target.value,
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Group name"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Group Description Font Size
              </Label>
              <Input
                type="number"
                value={settings.groupDescriptionFontSize}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    groupDescriptionFontSize: parseInt(e.target.value),
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
                value={settings.groupLabelPosition}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    groupLabelPosition: e.target
                      .value as GroupLabelPositionKeys,
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

            {/* <div className="bg-gray-50 rounded p-2">
              <div className="text-xs text-gray-500 mb-1">Group Statistics</div>
              <div className="text-sm font-medium">{groupBars.length} bars</div>
              <div className="text-sm font-medium">
                Total: {groupTotal.toLocaleString()}
              </div>
            </div> */}

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
              {/* <Button
                variant="outline"
                size="sm"
                // onClick={() => toggleGroupCollapse(currentGroup.id)}
                className="h-8 text-xs"
              >
                {currentGroup.collapsed ? (
                  <FolderOpen className="w-3 h-3" />
                ) : (
                  <Folder className="w-3 h-3" />
                )}
              </Button> */}
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

    if (modalState.type === "titleSection") {
      return (
        <div
          ref={modalRef}
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-72"
          style={{
            left: `${adjustedPosition.x}px`,
            top: `${adjustedPosition.y}px`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: chartTitleSection.name.color }}
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
                value={chartTitleSection.name.value}
                onChange={(e) =>
                  setChartTitleSection({
                    ...chartTitleSection,
                    name: { ...chartTitleSection.name, value: e.target.value },
                  })
                }
                className="h-8 text-sm"
                placeholder="Chart Name"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Name Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={chartTitleSection.name.color}
                  onChange={(e) =>
                    setChartTitleSection({
                      ...chartTitleSection,
                      name: {
                        ...chartTitleSection.name,
                        color: e.target.value,
                      },
                    })
                  }
                  className="w-12 h-8 p-1 border rounded"
                />
                <Select
                  value={chartTitleSection.name.color}
                  onValueChange={(value) =>
                    setChartTitleSection({
                      ...chartTitleSection,
                      name: {
                        ...chartTitleSection.name,
                        color: value,
                      },
                    })
                  }
                >
                  <SelectTrigger className="flex-1 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="text-xs">{color.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Title Font Size
              </Label>
              <Input
                type="number"
                value={chartTitleSection.name.fontSize}
                onChange={(e) => {
                  setChartTitleSection({
                    ...chartTitleSection,
                    name: {
                      ...chartTitleSection.name,
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
                value={chartTitleSection.description.value}
                onChange={(e) =>
                  setChartTitleSection({
                    ...chartTitleSection,
                    description: {
                      ...chartTitleSection.description,
                      value: e.target.value,
                    },
                  })
                }
                className="h-8 text-sm"
                placeholder="Chart Description"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Description Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={chartTitleSection.description.color}
                  onChange={(e) =>
                    setChartTitleSection({
                      ...chartTitleSection,
                      description: {
                        ...chartTitleSection.description,
                        color: e.target.value,
                      },
                    })
                  }
                  className="w-12 h-8 p-1 border rounded"
                />
                <Select
                  value={chartTitleSection.description.color}
                  onValueChange={(value) =>
                    setChartTitleSection({
                      ...chartTitleSection,
                      description: {
                        ...chartTitleSection.description,
                        color: value,
                      },
                    })
                  }
                >
                  <SelectTrigger className="flex-1 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="text-xs">{color.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">
                Chart Description Font Size
              </Label>
              <Input
                type="number"
                value={chartTitleSection.description.fontSize}
                onChange={(e) => {
                  setChartTitleSection({
                    ...chartTitleSection,
                    description: {
                      ...chartTitleSection.description,
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
          </div>
        </div>
      );
    }

    if (modalState.type === "chart") {
      return (
        <div
          ref={modalRef}
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-72"
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
    const labelWidth = settings.labelWidth;
    const padding = { top: 20, right: 20, bottom: 20, left: labelWidth + 20 };
    let groupLabelHeight = 10 + settings.groupLabelFontSize;
    let groupDescriptionHeight = settings?.groupDescriptionFontSize
      ? 10 + settings?.groupDescriptionFontSize
      : 0;

    if (settings.groupLabelPosition === "replaceBarLabels") {
      groupLabelHeight = barSpacing;
      groupDescriptionHeight = 0;
    }

    const totalNumberOfBars = groupedBars.reduce(
      (sum, group) => sum + group.bars.length,
      0
    );

    const totalHeightOfBars = totalNumberOfBars * (barHeight + barSpacing);
    const totalHeightOfGroup =
      groupedBars.length *
      (groupSpacing + groupLabelHeight + groupDescriptionHeight);

    const chartHeight =
      totalHeightOfBars +
      totalHeightOfGroup +
      chartTitleSection.name.fontSize +
      chartTitleSection.description.fontSize +
      padding.top +
      chartTitleSection.gap;

    const availableWidth = chartWidth - padding.left - padding.right;

    let currentY =
      chartTitleSection.name.fontSize +
      chartTitleSection.description.fontSize +
      padding.top +
      chartTitleSection.gap;

    return (
      <svg
        preserveAspectRatio="xMidYMid meet"
        ref={svgRef}
        width={chartBackgroundWidth}
        height={chartBackgroundHeight}
        viewBox={`0 0 ${chartBackgroundWidth} ${chartBackgroundHeight}`}
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
              font-family: 'MyFont';
              src: url(${font}) format('truetype');
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
            chartBackgroundHeight / 2 - chartHeight / 2
          })`}
        >
          {/* Chart Title */}
          <text
            x={chartWidth / 2}
            y={chartTitleSection.name.fontSize}
            textAnchor="middle"
            fill={chartTitleSection.name.color}
            style={{ fontFamily: "MyFont" }}
            fontSize={chartTitleSection.name.fontSize}
            onClick={(e) => openModal("titleSection", e)}
          >
            {chartTitleSection.name.value}
          </text>
          <text
            x={chartWidth / 2}
            y={
              chartTitleSection.description.fontSize +
              chartTitleSection.name.fontSize +
              chartTitleSection.gap
            }
            textAnchor="middle"
            fill={chartTitleSection.description.color}
            style={{ fontFamily: "MyFont" }}
            fontSize={chartTitleSection.description.fontSize}
            onClick={(e) => openModal("titleSection", e)}
          >
            {chartTitleSection.description.value}
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

            // if (group.collapsed) {
            //   // Render collapsed group header only
            //   const groupY = currentY;
            //   currentY += groupLabelHeight + 10;

            //   return (
            //     <g key={group.id}>
            //       {/* Group background */}
            //       <rect
            //         x={padding.left - labelWidth - 10}
            //         y={groupY - 5}
            //         width={labelWidth + availableWidth + 20}
            //         height={groupLabelHeight}
            //         fill={`rgba(${group.backgroundColor.r},${group.backgroundColor.g},${group.backgroundColor.b},${group.backgroundColor.a})`}
            //         stroke={`rgba(${group.backgroundColor.r},${group.backgroundColor.g},${group.backgroundColor.b},${group.backgroundColor.a})`}
            //         strokeWidth="1"
            //         rx="4"
            //         className="cursor-pointer hover:opacity-80 transition-opacity"
            //         onClick={(e) => openModal("group", e, group.id)}
            //       />

            //       {/* Group label */}
            //       <text
            //         x={padding.left - labelWidth - 5}
            //         y={groupY + groupLabelHeight / 2}
            //         alignmentBaseline="middle"
            //         className="fill-gray-800 text-sm font-bold cursor-pointer hover:fill-gray-600"
            //         onClick={(e) => {
            //           e.stopPropagation();
            //           // toggleGroupCollapse(group.id);
            //         }}
            //       >
            //         ▶ {group.label.value} ({groupBars.length} items)
            //       </text>
            //     </g>
            //   );
            // }

            // Render expanded group
            const groupStartY = currentY;
            currentY += groupLabelHeight + groupDescriptionHeight;

            const groupLabelPosition: Record<
              GroupLabelPositionKeys,
              { x: number; y: number; anchor: string }
            > = {
              left: {
                x: padding.left - labelWidth - 5,
                y: groupStartY + groupLabelHeight / 2,
                anchor: "start",
              },
              center: {
                x: chartWidth / 2,
                y: groupStartY + groupLabelHeight / 2,
                anchor: "middle",
              },
              right: {
                x: labelWidth + availableWidth + 10,
                y: groupStartY + groupLabelHeight / 2,
                anchor: "end",
              },
              replaceBarLabels: {
                x: padding.left - labelWidth - 5,
                y:
                  groupStartY +
                  (bars.length * (barHeight + barSpacing)) / bars.length,
                anchor: "start",
              },
            };

            const groupDescriptionPosition: Record<
              GroupLabelPositionKeys,
              { x: number; y: number; anchor: string }
            > = {
              left: {
                x: padding.left - labelWidth - 5,
                y: groupStartY + groupLabelHeight + groupDescriptionHeight / 2,
                anchor: "start",
              },
              center: {
                x: chartWidth / 2,
                y: groupStartY + groupLabelHeight + groupDescriptionHeight / 2,
                anchor: "middle",
              },
              right: {
                x: labelWidth + availableWidth + 10,
                y: groupStartY + groupLabelHeight + groupDescriptionHeight / 2,
                anchor: "end",
              },
              replaceBarLabels: {
                x: padding.left - labelWidth - 5,
                y:
                  groupStartY +
                  groupDescriptionHeight +
                  groupLabelHeight +
                  (bars.length * (barHeight + barSpacing)) / bars.length,
                anchor: "start",
              },
            };

            const groupElements = (
              <g key={group.id}>
                {/* Group background */}
                <rect
                  x={padding.left - labelWidth - 10}
                  y={groupStartY}
                  width={labelWidth + availableWidth + 20}
                  height={
                    groupLabelHeight +
                    groupDescriptionHeight +
                    groupBars.length * (barHeight + barSpacing)
                  }
                  fill={`rgba(${group.backgroundColor.r},${group.backgroundColor.g},${group.backgroundColor.b},${group.backgroundColor.a})`}
                  stroke={`rgba(${group.backgroundColor.r},${group.backgroundColor.g},${group.backgroundColor.b},${group.backgroundColor.a})`}
                  strokeWidth="1"
                  rx="6"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => openModal("group", e, group.id)}
                />

                {/* Group label */}
                <text
                  x={groupLabelPosition[settings.groupLabelPosition].x}
                  y={groupLabelPosition[settings.groupLabelPosition].y}
                  alignmentBaseline="middle"
                  textAnchor={
                    groupLabelPosition[settings.groupLabelPosition].anchor
                  }
                  className="cursor-pointer hover:fill-gray-600"
                  style={{ fontFamily: "MyFont" }}
                  fontSize={settings.groupLabelFontSize}
                  onClick={(e) => {
                    e.stopPropagation();
                    //   toggleGroupCollapse(group.id);
                  }}
                >
                  {/* ▼  */}
                  {group.label.value}
                </text>

                <text
                  x={groupDescriptionPosition[settings.groupLabelPosition].x}
                  y={groupDescriptionPosition[settings.groupLabelPosition].y}
                  textAnchor={
                    groupDescriptionPosition[settings.groupLabelPosition].anchor
                  }
                  alignmentBaseline="middle"
                  className="cursor-pointer hover:fill-gray-600"
                  style={{ fontFamily: "MyFont" }}
                  fontSize={settings.groupDescriptionFontSize}
                  onClick={(e) => {
                    e.stopPropagation();
                    //   toggleGroupCollapse(group.id);
                  }}
                >
                  {/* ▼  */}
                  {group?.description?.value ?? ""}
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
                      position: padding.left + barWidth + 8,
                      anchor: "start",
                    },
                    onForegroundRight: {
                      position: barWidth + labelWidth + 10,
                      anchor: "end",
                    },
                    onBackgroundRight: {
                      position: labelWidth + availableWidth + 10,
                      anchor: "end",
                    },
                    outside: {
                      position: chartWidth,
                      anchor: "start",
                    },
                  };

                  return (
                    <g key={bar.id}>
                      {/* Bar background */}
                      <rect
                        x={padding.left}
                        y={barY}
                        width={availableWidth}
                        height={barHeight}
                        fill={`rgba(${bar.backgroundColor.r},${bar.backgroundColor.g},${bar.backgroundColor.b},${bar.backgroundColor.a})`}
                        stroke={`rgba(${bar.backgroundColor.r},${bar.backgroundColor.g},${bar.backgroundColor.b},${bar.backgroundColor.a})`}
                        strokeWidth="1"
                        rx="3"
                        onClick={(e) => openModal("bar", e, bar.id)}
                      />

                      {/* Actual Bar */}
                      <rect
                        x={padding.left}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        fill={`rgba(${bar.foreGroundColor.r},${bar.foreGroundColor.g},${bar.foreGroundColor.b},${bar.foreGroundColor.a})`}
                        rx="3"
                        className="cursor-pointer transition-all duration-200 hover:opacity-80 hover:stroke-gray-400"
                        strokeWidth="0"
                        onClick={(e) => openModal("bar", e, bar.id)}
                      />

                      {/* Bar Label */}
                      <text
                        x={
                          settings.barLabelInside
                            ? padding.left + 10
                            : padding.left - 10
                        }
                        y={barY + barHeight / 2}
                        textAnchor={settings.barLabelInside ? "start" : "end"}
                        alignmentBaseline="middle"
                        className="cursor-pointer hover:fill-gray-900 hover:font-semibold transition-all"
                        style={{ fontFamily: "MyFont" }}
                        fontSize={settings.barLabelFontSize}
                        onClick={(e) => openModal("bar", e, bar.id)}
                      >
                        {bar.label.value}
                      </text>

                      {/* Bar Value */}
                      <text
                        x={barValuePosition[settings.barValuePosition].position}
                        y={barY + barHeight / 2}
                        textAnchor={
                          barValuePosition[settings.barValuePosition].anchor
                        }
                        alignmentBaseline="middle"
                        className="cursor-pointer hover:fill-gray-900"
                        style={{ fontFamily: "MyFont" }}
                        fontSize={settings.barValueFontSize}
                        onClick={(e) => openModal("bar", e, bar.id)}
                      >
                        {bar.value.value.toLocaleString()}
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
                        rx="5"
                        className="pointer-events-none opacity-0 hover:opacity-100 hover:stroke-blue-400 transition-all"
                      />
                    </g>
                  );
                })}
              </g>
            );

            currentY +=
              groupBars.length * (barHeight + barSpacing + groupSpacing);
            return groupElements;
          })}
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
                      {template.chartTitleSection.name.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {template.chartTitleSection.description.value}
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
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Dynamic Edit Modal */}
      {renderEditModal()}
    </div>
  );
};
