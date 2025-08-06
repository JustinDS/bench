import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFont } from "@/app/contexts/fontContext";
import { RgbaColor } from "react-colorful";
import { Button } from "../../ui/button";
import {
  Copy,
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

interface ChartBar {
  id: string;
  label: string;
  value: number;
  color: string;
  groupId: string;
}

interface ChartGroup {
  id: string;
  label: string;
  color: string;
  collapsed: boolean;
}

interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  groups: ChartGroup[];
  bars: ChartBar[];
  chartType: "horizontal" | "vertical";
}

interface ModalState {
  isOpen: boolean;
  type: "bar" | "group" | null;
  itemId: string | null;
  position: { x: number; y: number };
}

const defaultTemplates: ChartTemplate[] = [
  {
    id: "GpuCpu",
    name: "CPU GPU Compare",
    description: "Compare AMD and Intel",
    chartType: "horizontal",
    groups: [
      { id: "High", label: "High", color: "#8B5CF6", collapsed: false },
      { id: "Medium", label: "Medium", color: "#10B981", collapsed: false },
      { id: "Low", label: "Low", color: "#C084FC", collapsed: false },
    ],
    bars: [
      {
        id: "1",
        label: "AMD CPU",
        value: 4500,
        color: "#8B5CF6",
        groupId: "High",
      },
      {
        id: "2",
        label: "AMD GPU",
        value: 5200,
        color: "#A855F7",
        groupId: "High",
      },
      {
        id: "3",
        label: "Intel CPU",
        value: 4800,
        color: "#C084FC",
        groupId: "Medium",
      },
      {
        id: "4",
        label: "Geforce GPU",
        value: 6100,
        color: "#10B981",
        groupId: "Medium",
      },
      {
        id: "5",
        label: "Intel CPU",
        value: 5800,
        color: "#34D399",
        groupId: "Low",
      },
      {
        id: "6",
        label: "Geforce GPU",
        value: 7200,
        color: "#6EE7B7",
        groupId: "Low",
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
  const [groups, setGroups] = useState<ChartGroup[]>([
    { id: "group1", label: "Group A", color: "#8B5CF6", collapsed: false },
    { id: "group2", label: "Group B", color: "#10B981", collapsed: false },
  ]);
  const [bars, setBars] = useState<ChartBar[]>([
    {
      id: "1",
      label: "Item 1",
      value: 400,
      color: "#8B5CF6",
      groupId: "group1",
    },
    {
      id: "2",
      label: "Item 2",
      value: 300,
      color: "#A855F7",
      groupId: "group1",
    },
    {
      id: "3",
      label: "Item 3",
      value: 500,
      color: "#10B981",
      groupId: "group2",
    },
    {
      id: "4",
      label: "Item 4",
      value: 200,
      color: "#34D399",
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

  const maxValue = useMemo(
    () => Math.max(...bars.map((bar) => bar.value), 1),
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
    type: "bar" | "group",
    itemId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    // Get the chart container's bounding rect
    const chartRect = chartRef.current?.getBoundingClientRect();
    if (!chartRect) return;

    // Calculate position relative to the chart container
    const x = event.clientX - chartRect.left;
    const y = event.clientY - chartRect.top;

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
      label: `Group ${groups.length + 1}`,
      color: colorOptions[groups.length % colorOptions.length].value,
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
        label: "Default Group",
        color: "#8B5CF6",
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
      label: `Item ${bars.length + 1}`,
      value: 100,
      color: group?.color || colorOptions[0].value,
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
        label: `${barToDuplicate.label} Copy`,
      };
      setBars([...bars, newBar]);
    }
  };

  const loadTemplate = (template: ChartTemplate) => {
    setGroups(template.groups);
    setBars(template.bars);
    setChartType(template.chartType);
    closeModal();
  };

  const resetChart = () => {
    setGroups([
      { id: "group1", label: "Group A", color: "#8B5CF6", collapsed: false },
      { id: "group2", label: "Group B", color: "#10B981", collapsed: false },
    ]);
    setBars([
      {
        id: "1",
        label: "Item 1",
        value: 400,
        color: "#8B5CF6",
        groupId: "group1",
      },
      {
        id: "2",
        label: "Item 2",
        value: 300,
        color: "#A855F7",
        groupId: "group1",
      },
      {
        id: "3",
        label: "Item 3",
        value: 500,
        color: "#10B981",
        groupId: "group2",
      },
      {
        id: "4",
        label: "Item 4",
        value: 200,
        color: "#34D399",
        groupId: "group2",
      },
    ]);
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
                style={{ backgroundColor: currentBar.color }}
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
                value={currentBar.label}
                onChange={(e) =>
                  updateBar(currentBar.id, { label: e.target.value })
                }
                className="h-8 text-sm"
                placeholder="Bar label"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Value</Label>
              <Input
                type="number"
                value={currentBar.value}
                onChange={(e) =>
                  updateBar(currentBar.id, {
                    value: parseFloat(e.target.value) || 0,
                  })
                }
                className="h-8 text-sm"
                placeholder="Bar value"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentBar.color}
                  onChange={(e) =>
                    updateBar(currentBar.id, { color: e.target.value })
                  }
                  className="w-12 h-8 p-1 border rounded"
                />
                <Select
                  value={currentBar.color}
                  onValueChange={(value) =>
                    updateBar(currentBar.id, { color: value })
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
            </div>

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
      const groupTotal = groupBars.reduce((sum, bar) => sum + bar.value, 0);

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
                style={{ backgroundColor: currentGroup.color }}
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
                value={currentGroup.label}
                onChange={(e) =>
                  updateGroup(currentGroup.id, { label: e.target.value })
                }
                className="h-8 text-sm"
                placeholder="Group name"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentGroup.color}
                  onChange={(e) =>
                    updateGroup(currentGroup.id, { color: e.target.value })
                  }
                  className="w-12 h-8 p-1 border rounded"
                />
                <Select
                  value={currentGroup.color}
                  onValueChange={(value) =>
                    updateGroup(currentGroup.id, { color: value })
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

            <div className="bg-gray-50 rounded p-2">
              <div className="text-xs text-gray-500 mb-1">Group Statistics</div>
              <div className="text-sm font-medium">{groupBars.length} bars</div>
              <div className="text-sm font-medium">
                Total: {groupTotal.toLocaleString()}
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
                // onClick={() => toggleGroupCollapse(currentGroup.id)}
                className="h-8 text-xs"
              >
                {currentGroup.collapsed ? (
                  <FolderOpen className="w-3 h-3" />
                ) : (
                  <Folder className="w-3 h-3" />
                )}
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

    return null;
  };

  const renderHorizontalChart = () => {
    const chartWidth = 1000;

    const barHeight = 60;
    const barSpacing = 10;
    const groupSpacing = 40;
    const groupLabelHeight = 25;
    const labelWidth = 140;

    const chartTitleHeight = 60;
    const padding = { top: 50, right: 40, bottom: 40, left: labelWidth + 20 };

    const totalNumberOfBars = groupedBars.reduce(
      (sum, group) => sum + group.bars.length,
      0
    );

    const totalHeightOfBars =
      totalNumberOfBars * (barHeight + barSpacing) + chartTitleHeight;
    const totalHeightOfGroup =
      groupedBars.length * (groupSpacing + groupLabelHeight);

    const chartHeight = totalHeightOfBars + totalHeightOfGroup;

    const availableWidth = chartWidth - padding.left - padding.right;

    let currentY = chartTitleHeight;

    return (
      <svg
        width="100%"
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="border rounded-lg bg-white cursor-pointer"
      >
        {/* Background Grid */}
        <defs>
          <pattern
            id="grid"
            width="50"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 20"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Chart Title */}
        <text
          x={chartWidth / 2}
          y={25}
          textAnchor="middle"
          className="fill-gray-800 text-lg font-semibold"
        >
          {"Test Group"}
        </text>
        <text
          x={chartWidth / 2}
          y={40}
          textAnchor="middle"
          className="fill-gray-500 text-xs"
        >
          {"Test Group click to edit"}
        </text>

        {/* Y-axis line */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={chartHeight - padding.bottom}
          stroke="#e2e8f0"
          strokeWidth="2"
        />

        {/* X-axis line */}
        <line
          x1={padding.left}
          y1={chartHeight - padding.bottom}
          x2={chartWidth - padding.right}
          y2={chartHeight - padding.bottom}
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
                y1={chartHeight - padding.bottom}
                x2={x}
                y2={chartHeight - padding.bottom + 5}
                stroke="#94a3b8"
                strokeWidth="1"
              />
              <text
                x={x}
                y={chartHeight - padding.bottom + 18}
                textAnchor="middle"
                className="fill-gray-600 text-xs"
              >
                {value.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Render Groups and Bars */}
        {groupedBars.map((groupData, groupIndex) => {
          const { group, bars: groupBars } = groupData;

          if (group.collapsed) {
            // Render collapsed group header only
            const groupY = currentY;
            currentY += groupLabelHeight + 10;

            return (
              <g key={group.id}>
                {/* Group background */}
                <rect
                  x={padding.left - labelWidth - 10}
                  y={groupY - 5}
                  width={labelWidth + availableWidth + 20}
                  height={groupLabelHeight}
                  fill={`${group.color}15`}
                  stroke={group.color}
                  strokeWidth="1"
                  rx="4"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => openModal("group", group.id, e)}
                />

                {/* Group label */}
                <text
                  x={padding.left - labelWidth - 5}
                  y={groupY + groupLabelHeight / 2}
                  alignmentBaseline="middle"
                  className="fill-gray-800 text-sm font-bold cursor-pointer hover:fill-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    // toggleGroupCollapse(group.id);
                  }}
                >
                  ▶ {group.label} ({groupBars.length} items)
                </text>
              </g>
            );
          }

          // Render expanded group
          const groupStartY = currentY;
          currentY += groupLabelHeight;

          const groupElements = (
            <g key={group.id}>
              {/* Group background */}
              <rect
                x={padding.left - labelWidth - 10}
                y={groupStartY - 5}
                width={labelWidth + availableWidth + 20}
                height={
                  groupLabelHeight + groupBars.length * (barHeight + barSpacing)
                }
                fill={`${group.color}10`}
                stroke={`${group.color}40`}
                strokeWidth="1"
                rx="6"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => openModal("group", group.id, e)}
              />

              {/* Group label */}
              <text
                x={padding.left - labelWidth - 5}
                y={groupStartY + groupLabelHeight / 2}
                alignmentBaseline="middle"
                className="fill-gray-800 text-sm font-bold cursor-pointer hover:fill-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  //   toggleGroupCollapse(group.id);
                }}
              >
                {/* ▼  */}
                {group.label}
              </text>

              {/* Group bars */}
              {groupBars.map((bar, barIndex) => {
                const barWidth = (bar.value / maxValue) * availableWidth;
                const barY = currentY + barIndex * (barHeight + barSpacing);

                return (
                  <g key={bar.id}>
                    {/* Bar background */}
                    <rect
                      x={padding.left}
                      y={barY}
                      width={availableWidth}
                      height={barHeight}
                      fill="#f8fafc"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      rx="3"
                    />

                    {/* Actual Bar */}
                    <rect
                      x={padding.left}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill={bar.color}
                      rx="3"
                      className="cursor-pointer transition-all duration-200 hover:opacity-80 hover:stroke-gray-400"
                      strokeWidth="0"
                      onClick={(e) => openModal("bar", bar.id, e)}
                    />

                    {/* Bar Label */}
                    <text
                      x={padding.left - 10}
                      y={barY + barHeight / 2}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      className="fill-gray-700 text-xs font-medium cursor-pointer hover:fill-gray-900 hover:font-semibold transition-all"
                      onClick={(e) => openModal("bar", bar.id, e)}
                    >
                      {bar.label}
                    </text>

                    {/* Bar Value */}
                    <text
                      x={padding.left + barWidth + 8}
                      y={barY + barHeight / 2}
                      textAnchor="start"
                      alignmentBaseline="middle"
                      className="fill-gray-700 text-xs font-semibold cursor-pointer hover:fill-gray-900"
                      onClick={(e) => openModal("bar", bar.id, e)}
                    >
                      {bar.value.toLocaleString()}
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
            groupBars.length * (barHeight + barSpacing) + groupSpacing;
          return groupElements;
        })}
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
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {template.description}
                    </div>
                  </div>
                </Button>
              ))}
              <Button variant="outline" className="w-full" onClick={resetChart}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Chart
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
