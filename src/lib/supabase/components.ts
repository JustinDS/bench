import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/types/database.types";
import type {
  ComponentFilter,
  GPUFilter,
  RAMFilter,
} from "@/lib/validations/component.schemas";

// Initialize client - call this at the top of each function that needs it
const getSupabaseClient = () => createClient();

// ==========================================
// LOOKUP DATA FETCHERS
// ==========================================

export async function getCategories() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("component_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getChipBrands() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("chip_brands")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getBoardManufacturers() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("board_manufacturers")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getManufacturerSeriesByBoardManufacturer(
  manufacturerId: string,
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("manufacturer_series")
    .select("*")
    .eq("board_manufacturer_id", manufacturerId)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

// ==========================================
// COMPONENT CRUD
// ==========================================

export async function getComponents(filter?: ComponentFilter) {
  const supabase = getSupabaseClient();
  let query = supabase
    .from("components")
    .select(
      `
      *,
      category:component_categories(*),
      chipBrands:chip_brands(*),
      boardManufacturers:board_manufacturers(*),
      manufacturerSeries:manufacturer_series(*)
    `,
    )
    .order("created_at", { ascending: false });

  if (filter?.category_id) {
    query = query.eq("category_id", filter.category_id);
  }
  if (filter?.chip_brand_id) {
    query = query.eq("chip_brand_id", filter.chip_brand_id);
  }
  if (filter?.board_manufacturer_id) {
    query = query.eq("board_manufacturer_id", filter.board_manufacturer_id);
  }
  if (filter?.is_admin_approved !== undefined) {
    query = query.eq("is_admin_approved", filter.is_admin_approved);
  }
  if (filter?.search) {
    query = query.or(
      `product_name.ilike.%${filter.search}%,model.ilike.%${filter.search}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getComponentById(id: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("components")
    .select(
      `
      *,
      category:component_categories(*),
      chipBrands:chip_brands(*),
      boardManufacturers:board_manufacturers(*),
      manufacturerSeries:manufacturer_series(*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createComponent(
  component: Database["public"]["Tables"]["components"]["Insert"],
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("components")
    .insert(component)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateComponent(
  id: string,
  component: Database["public"]["Tables"]["components"]["Update"],
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("components")
    .update(component)
    .eq("id", id)
    .select()
    .single();

  debugger;

  if (error) throw error;
  return data;
}

export async function deleteComponent(id: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("components").delete().eq("id", id);

  if (error) throw error;
}

// ==========================================
// GPU SPECIFIC
// ==========================================

export async function getGPUs(filter?: GPUFilter) {
  const supabase = getSupabaseClient();
  let query = supabase
    .from("components")
    .select(
      `
      *,
      category:component_categories(*),
      chipBrand:chip_brands(*),
      boardManufacturer:board_manufacturers(*),
      manufacturerSeries:manufacturer_series(*),
      gpu_specs(*)
    `,
    )
    .eq(
      "category_id",
      (
        await supabase
          .from("component_categories")
          .select("id")
          .eq("name", "GPU")
          .single()
      ).data?.id || "",
    )
    .order("created_at", { ascending: false });

  // Apply base component filters
  if (filter?.chip_brand_id)
    query = query.eq("chip_brand_id", filter.chip_brand_id);
  if (filter?.board_manufacturer_id)
    query = query.eq("board_manufacturer_id", filter.board_manufacturer_id);
  if (filter?.is_admin_approved !== undefined)
    query = query.eq("is_admin_approved", filter.is_admin_approved);
  if (filter?.search) {
    query = query.or(
      `product_name.ilike.%${filter.search}%,model.ilike.%${filter.search}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  // Client-side filtering for GPU specs (can't join filter in Supabase easily)
  let filtered = data;
  if (filter?.vram_size) {
    filtered = filtered.filter(
      (gpu) => gpu?.gpu_specs?.vram_size === filter.vram_size,
    );
  }
  if (filter?.min_vram) {
    filtered = filtered.filter(
      (gpu) => (gpu.gpu_specs?.vram_size || 0) >= filter.min_vram!,
    );
  }
  if (filter?.vram_type) {
    filtered = filtered.filter(
      (gpu) => gpu.gpu_specs?.vram_type === filter.vram_type,
    );
  }

  return filtered;
}

export async function getGPUById(id: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("components")
    .select(
      `
      *,
      category:component_categories(*),
      chipBrands:chip_brands(*),
      boardManufacturers:board_manufacturers(*),
      manufacturerSeries:manufacturer_series(*),
      gpu_specs(*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createGPU(
  component: Database["public"]["Tables"]["components"]["Insert"],
  specs: Database["public"]["Tables"]["gpu_specs"]["Insert"],
) {
  const supabase = getSupabaseClient();
  // Create component first
  const componentData = await createComponent(component);

  // Then create specs
  const { data: specsData, error: specsError } = await supabase
    .from("gpu_specs")
    .insert({ ...specs, component_id: componentData.id })
    .select()
    .single();

  if (specsError) {
    // Rollback component creation if specs fail
    await deleteComponent(componentData.id);
    throw specsError;
  }

  return { component: componentData, specs: specsData };
}

export async function updateGPUSpecs(
  componentId: string,
  specs: Database["public"]["Tables"]["gpu_specs"]["Update"],
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("gpu_specs")
    .update(specs)
    .eq("component_id", componentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ==========================================
// CPU SPECIFIC
// ==========================================

export async function getCPUs(filter?: ComponentFilter) {
  const supabase = getSupabaseClient();
  const { data: category } = await supabase
    .from("component_categories")
    .select("id")
    .eq("name", "CPU")
    .single();

  if (!category) throw new Error("CPU category not found");

  let query = supabase
    .from("components")
    .select(
      `
      *,
      category:component_categories(*),
      chipBrand:chip_brands(*),
      boardManufacturer:board_manufacturers(*),
      manufacturerSeries:manufacturer_series(*),
      cpu_specs(*)
    `,
    )
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  if (filter?.chip_brand_id)
    query = query.eq("chip_brand_id", filter.chip_brand_id);
  if (filter?.is_admin_approved !== undefined)
    query = query.eq("is_admin_approved", filter.is_admin_approved);
  if (filter?.search) {
    query = query.or(
      `product_name.ilike.%${filter.search}%,model.ilike.%${filter.search}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createCPU(
  component: Database["public"]["Tables"]["components"]["Insert"],
  specs: Database["public"]["Tables"]["cpu_specs"]["Insert"],
) {
  const supabase = getSupabaseClient();
  const componentData = await createComponent(component);

  const { data: specsData, error: specsError } = await supabase
    .from("cpu_specs")
    .insert({ ...specs, component_id: componentData.id })
    .select()
    .single();

  if (specsError) {
    await deleteComponent(componentData.id);
    throw specsError;
  }

  return { component: componentData, specs: specsData };
}

export async function updateCPUSpecs(
  componentId: string,
  specs: Database["public"]["Tables"]["cpu_specs"]["Update"],
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("cpu_specs")
    .update(specs)
    .eq("component_id", componentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ==========================================
// RAM SPECIFIC
// ==========================================

export async function getRAM(filter?: RAMFilter) {
  const supabase = getSupabaseClient();
  const { data: category } = await supabase
    .from("component_categories")
    .select("id")
    .eq("name", "RAM")
    .single();

  if (!category) throw new Error("RAM category not found");

  let query = supabase
    .from("components")
    .select(
      `
      *,
      category:component_categories(*),
      chipBrand:chip_brands(*),
      boardManufacturer:board_manufacturers(*),
      manufacturerSeries:manufacturer_series(*),
      ram_specs(*)
    `,
    )
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  if (filter?.chip_brand_id)
    query = query.eq("chip_brand_id", filter.chip_brand_id);
  if (filter?.is_admin_approved !== undefined)
    query = query.eq("is_admin_approved", filter.is_admin_approved);
  if (filter?.search) {
    query = query.or(
      `product_name.ilike.%${filter.search}%,model.ilike.%${filter.search}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  // Client-side filtering for RAM specs
  let filtered = data;
  if (filter?.memory_type) {
    filtered = filtered.filter(
      (ram) => ram.ram_specs?.memory_type === filter.memory_type,
    );
  }
  if (filter?.min_capacity) {
    filtered = filtered.filter(
      (ram) => (ram.ram_specs?.capacity || 0) >= filter.min_capacity!,
    );
  }
  if (filter?.min_speed) {
    filtered = filtered.filter(
      (ram) => (ram.ram_specs?.speed || 0) >= filter.min_speed!,
    );
  }
  if (filter?.rgb !== undefined) {
    filtered = filtered.filter((ram) => ram.ram_specs?.rgb === filter.rgb);
  }

  return filtered;
}

export async function createRAM(
  component: Database["public"]["Tables"]["components"]["Insert"],
  specs: Database["public"]["Tables"]["ram_specs"]["Insert"],
) {
  const supabase = getSupabaseClient();
  const componentData = await createComponent(component);

  const { data: specsData, error: specsError } = await supabase
    .from("ram_specs")
    .insert({ ...specs, component_id: componentData.id })
    .select()
    .single();

  if (specsError) {
    await deleteComponent(componentData.id);
    throw specsError;
  }

  return { component: componentData, specs: specsData };
}

export async function updateRAMSpecs(
  componentId: string,
  specs: Database["public"]["Tables"]["ram_specs"]["Update"],
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("ram_specs")
    .update(specs)
    .eq("component_id", componentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
