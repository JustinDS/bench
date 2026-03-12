import { Database } from "./database.types";

export type ComponentCategory =
  Database["public"]["Tables"]["component_categories"]["Row"];
export type ChipBrand = Database["public"]["Tables"]["chip_brands"]["Row"];
export type BoardManufacturer =
  Database["public"]["Tables"]["board_manufacturers"]["Row"];
export type ManufacturerSeries =
  Database["public"]["Tables"]["manufacturer_series"]["Row"];
export type Component = Database["public"]["Tables"]["components"]["Row"];
export type GPUSpecs = Database["public"]["Tables"]["gpu_specs"]["Row"];
export type CPUSpecs = Database["public"]["Tables"]["cpu_specs"]["Row"];
export type RAMSpecs = Database["public"]["Tables"]["ram_specs"]["Row"];

// Full component types with relations
export type ComponentWithRelations = Component & {
  category?: ComponentCategory;
  chipBrand?: ChipBrand;
  boardManufacturer?: BoardManufacturer | null;
  manufacturerSeries?: ManufacturerSeries | null;
};

export type GPUWithSpecs = ComponentWithRelations & {
  gpu_specs?: GPUSpecs;
};

export type CPUWithSpecs = ComponentWithRelations & {
  cpu_specs?: CPUSpecs;
};

export type RAMWithSpecs = ComponentWithRelations & {
  ram_specs?: RAMSpecs;
};
