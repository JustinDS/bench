import { Database } from "./database.types";

export type ComponentCategory =
  Database["public"]["Tables"]["component_categories"]["Row"];
export type Brand = Database["public"]["Tables"]["brands"]["Row"];
export type Partner = Database["public"]["Tables"]["partners"]["Row"];
export type ProductSeries =
  Database["public"]["Tables"]["product_series"]["Row"];
export type Component = Database["public"]["Tables"]["components"]["Row"];
export type GPUSpecs = Database["public"]["Tables"]["gpu_specs"]["Row"];
export type CPUSpecs = Database["public"]["Tables"]["cpu_specs"]["Row"];
export type RAMSpecs = Database["public"]["Tables"]["ram_specs"]["Row"];

// Full component types with relations
export type ComponentWithRelations = Component & {
  category?: ComponentCategory;
  brand?: Brand;
  partner?: Partner | null;
  series?: ProductSeries | null;
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
