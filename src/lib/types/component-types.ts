// Component type enum - managed in frontend
export enum ComponentType {
  GPU = 1,
  CPU = 2,
  RAM = 3,
  COOLING = 4,
  PSU = 5,
  MOBO = 6,
  MONITOR = 7,
  SSD = 8,
  CHASSIS = 9,
  PERIPHERAL = 10,
}

// Helper to get display name
export function getComponentTypeLabel(type: ComponentType): string {
  const labels: Record<ComponentType, string> = {
    [ComponentType.GPU]: "Graphics Card",
    [ComponentType.CPU]: "Processor",
    [ComponentType.RAM]: "Memory",
    [ComponentType.COOLING]: "Cooling",
    [ComponentType.PSU]: "Power Supply",
    [ComponentType.MOBO]: "Motherboard",
    [ComponentType.MONITOR]: "Monitor",
    [ComponentType.SSD]: "Storage",
    [ComponentType.CHASSIS]: "Case",
    [ComponentType.PERIPHERAL]: "Peripheral",
  };
  return labels[type];
}

// Helper to get all component types as array
export function getAllComponentTypes(): ComponentType[] {
  return Object.values(ComponentType).filter(
    (v) => typeof v === "number",
  ) as ComponentType[];
}

// Helper to get component type from string name
export function getComponentTypeFromName(name: string): ComponentType | null {
  const normalized = name.toUpperCase();
  switch (normalized) {
    case "GPU":
      return ComponentType.GPU;
    case "CPU":
      return ComponentType.CPU;
    case "RAM":
      return ComponentType.RAM;
    case "COOLING":
      return ComponentType.COOLING;
    case "PSU":
      return ComponentType.PSU;
    case "MOBO":
    case "MOTHERBOARD":
      return ComponentType.MOBO;
    case "MONITOR":
      return ComponentType.MONITOR;
    case "SSD":
    case "STORAGE":
      return ComponentType.SSD;
    case "CHASSIS":
    case "CASE":
      return ComponentType.CHASSIS;
    case "PERIPHERAL":
      return ComponentType.PERIPHERAL;
    default:
      return null;
  }
}

// Helper to get component type from category name (for backwards compatibility)
export function getCategoryComponentType(
  categoryName: string,
): ComponentType | null {
  return getComponentTypeFromName(categoryName);
}
