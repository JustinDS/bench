import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/types/database.types";
import { ComponentType } from "@/lib/types/component-types";

const getSupabaseClient = () => createClient();

// ==========================================
// FILTERED LOOKUP DATA FETCHERS
// ==========================================

/**
 * Get chip brands that are valid for a specific component type
 * Uses junction table to filter
 */
export async function getChipBrandsForComponentType(
  componentType: ComponentType,
) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("chip_brands")
    .select(
      `
      *,
      chip_brand_component_types!inner(component_type)
    `,
    )
    .eq("chip_brand_component_types.component_type", componentType)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get board manufacturers that are valid for a specific component type
 * Uses junction table to filter
 */
export async function getBoardManufacturersForComponentType(
  componentType: ComponentType,
) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("board_manufacturers")
    .select(
      `
      *,
      manufacturer_component_types!inner(component_type)
    `,
    )
    .eq("manufacturer_component_types.component_type", componentType)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get manufacturer series that are valid for a specific component type
 * Uses junction table to filter
 */
export async function getManufacturerSeriesForComponentType(
  componentType: ComponentType,
) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("manufacturer_series")
    .select(
      `
      *,
      manufacturer_series_component_types!inner(component_type)
    `,
    )
    .eq("manufacturer_series_component_types.component_type", componentType)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get series for a specific board manufacturer AND component type
 * This is useful for cascading dropdowns (manufacturer selected first, then filter series)
 */
export async function getSeriesByManufacturerAndComponentType(
  boardManufacturerId: string,
  componentType: ComponentType,
) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("manufacturer_series")
    .select(
      `
      *,
      manufacturer_series_component_types!inner(component_type)
    `,
    )
    .eq("board_manufacturer_id", boardManufacturerId)
    .eq("manufacturer_series_component_types.component_type", componentType)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get all chip brands (unfiltered) - for admin purposes
 */
export async function getAllChipBrands() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("chip_brands")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get all board manufacturers (unfiltered) - for admin purposes
 */
export async function getAllBoardManufacturers() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("board_manufacturers")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get all manufacturer series (unfiltered) - for admin purposes
 */
export async function getAllManufacturerSeries() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("manufacturer_series")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

// ==========================================
// CHIP BRAND COMPONENT TYPE MANAGEMENT
// ==========================================

/**
 * Add a component type to a chip brand
 */
export async function addChipBrandComponentType(
  chipBrandId: string,
  componentType: ComponentType,
) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("chip_brand_component_types")
    .insert({ chip_brand_id: chipBrandId, component_type: componentType })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove a component type from a chip brand
 */
export async function removeChipBrandComponentType(
  chipBrandId: string,
  componentType: ComponentType,
) {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("chip_brand_component_types")
    .delete()
    .eq("chip_brand_id", chipBrandId)
    .eq("component_type", componentType);

  if (error) throw error;
}

/**
 * Set all component types for a chip brand (replaces existing)
 */
export async function setChipBrandComponentTypes(
  chipBrandId: string,
  componentTypes: ComponentType[],
) {
  const supabase = getSupabaseClient();

  // Delete existing
  await supabase
    .from("chip_brand_component_types")
    .delete()
    .eq("chip_brand_id", chipBrandId);

  // Insert new
  if (componentTypes.length > 0) {
    const { error } = await supabase
      .from("chip_brand_component_types")
      .insert(
        componentTypes.map((ct) => ({
          chip_brand_id: chipBrandId,
          component_type: ct,
        })),
      );

    if (error) throw error;
  }
}

/**
 * Get component types for a chip brand
 * Returns array of ComponentType enums
 */
export async function getChipBrandComponentTypes(
  chipBrandId: string,
): Promise<ComponentType[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("chip_brand_component_types")
    .select("component_type")
    .eq("chip_brand_id", chipBrandId);

  if (error) throw error;
  return data?.map((d) => d.component_type as ComponentType) || [];
}

/**
 * Check if a chip brand supports a specific component type
 */
export async function chipBrandSupportsComponentType(
  chipBrandId: string,
  componentType: ComponentType,
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("chip_brand_component_types")
    .select("id")
    .eq("chip_brand_id", chipBrandId)
    .eq("component_type", componentType)
    .single();

  return !error && !!data;
}

// ==========================================
// BOARD MANUFACTURER COMPONENT TYPE MANAGEMENT
// ==========================================

/**
 * Add a component type to a board manufacturer
 */
export async function addBoardManufacturerComponentType(
  boardManufacturerId: string,
  componentType: ComponentType,
) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("manufacturer_component_types")
    .insert({
      board_manufacturer_id: boardManufacturerId,
      component_type: componentType,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove a component type from a board manufacturer
 */
export async function removeBoardManufacturerComponentType(
  boardManufacturerId: string,
  componentType: ComponentType,
) {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("manufacturer_component_types")
    .delete()
    .eq("board_manufacturer_id", boardManufacturerId)
    .eq("component_type", componentType);

  if (error) throw error;
}

/**
 * Set all component types for a board manufacturer (replaces existing)
 */
export async function setBoardManufacturerComponentTypes(
  boardManufacturerId: string,
  componentTypes: ComponentType[],
) {
  const supabase = getSupabaseClient();

  // Delete existing
  await supabase
    .from("manufacturer_component_types")
    .delete()
    .eq("board_manufacturer_id", boardManufacturerId);

  // Insert new
  if (componentTypes.length > 0) {
    const { error } = await supabase
      .from("manufacturer_component_types")
      .insert(
        componentTypes.map((ct) => ({
          board_manufacturer_id: boardManufacturerId,
          component_type: ct,
        })),
      );

    if (error) throw error;
  }
}

/**
 * Get component types for a board manufacturer
 * Returns array of ComponentType enums
 */
export async function getBoardManufacturerComponentTypes(
  boardManufacturerId: string,
): Promise<ComponentType[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("manufacturer_component_types")
    .select("component_type")
    .eq("board_manufacturer_id", boardManufacturerId);

  if (error) throw error;
  return data?.map((d) => d.component_type as ComponentType) || [];
}

/**
 * Check if a board manufacturer supports a specific component type
 */
export async function boardManufacturerSupportsComponentType(
  boardManufacturerId: string,
  componentType: ComponentType,
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("manufacturer_component_types")
    .select("id")
    .eq("board_manufacturer_id", boardManufacturerId)
    .eq("component_type", componentType)
    .single();

  return !error && !!data;
}

// ==========================================
// MANUFACTURER SERIES COMPONENT TYPE MANAGEMENT
// ==========================================

/**
 * Add a component type to a manufacturer series
 */
export async function addManufacturerSeriesComponentType(
  manufacturerSeriesId: string,
  componentType: ComponentType,
) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("manufacturer_series_component_types")
    .insert({
      manufacturer_series_id: manufacturerSeriesId,
      component_type: componentType,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove a component type from a manufacturer series
 */
export async function removeManufacturerSeriesComponentType(
  manufacturerSeriesId: string,
  componentType: ComponentType,
) {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("manufacturer_series_component_types")
    .delete()
    .eq("manufacturer_series_id", manufacturerSeriesId)
    .eq("component_type", componentType);

  if (error) throw error;
}

/**
 * Set all component types for a manufacturer series (replaces existing)
 */
export async function setManufacturerSeriesComponentTypes(
  manufacturerSeriesId: string,
  componentTypes: ComponentType[],
) {
  const supabase = getSupabaseClient();

  // Delete existing
  await supabase
    .from("manufacturer_series_component_types")
    .delete()
    .eq("manufacturer_series_id", manufacturerSeriesId);

  // Insert new
  if (componentTypes.length > 0) {
    const { error } = await supabase
      .from("manufacturer_series_component_types")
      .insert(
        componentTypes.map((ct) => ({
          manufacturer_series_id: manufacturerSeriesId,
          component_type: ct,
        })),
      );

    if (error) throw error;
  }
}

/**
 * Get component types for a manufacturer series
 * Returns array of ComponentType enums
 */
export async function getManufacturerSeriesComponentTypes(
  manufacturerSeriesId: string,
): Promise<ComponentType[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("manufacturer_series_component_types")
    .select("component_type")
    .eq("manufacturer_series_id", manufacturerSeriesId);

  if (error) throw error;
  return data?.map((d) => d.component_type as ComponentType) || [];
}

/**
 * Check if a manufacturer series supports a specific component type
 */
export async function manufacturerSeriesSupportsComponentType(
  manufacturerSeriesId: string,
  componentType: ComponentType,
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("manufacturer_series_component_types")
    .select("id")
    .eq("manufacturer_series_id", manufacturerSeriesId)
    .eq("component_type", componentType)
    .single();

  return !error && !!data;
}
