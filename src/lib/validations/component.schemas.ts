import { z } from 'zod'

// Base component schema
export const componentSchema = z.object({
  category_id: z.string().uuid('Invalid category'),
  brand_id: z.string().uuid('Invalid brand'),
  partner_id: z.string().uuid().nullable().optional(),
  series_id: z.string().uuid().nullable().optional(),
  model: z.string().min(1, 'Model is required').max(100),
  product_name: z.string().min(1, 'Product name is required'),
  is_admin_approved: z.boolean().default(false),
})

export type ComponentFormData = z.infer<typeof componentSchema>

// GPU Specs Schema
export const gpuSpecsSchema = z.object({
  chip_series: z.string().max(50).nullable().optional(),
  chip_model: z.string().max(50).nullable().optional(),
  vram_size: z.coerce.number().int().positive().nullable().optional(),
  vram_type: z.enum(['GDDR6', 'GDDR6X', 'GDDR7', 'HBM2', 'HBM3']).nullable().optional(),
  base_clock: z.coerce.number().int().positive().nullable().optional(),
  boost_clock: z.coerce.number().int().positive().nullable().optional(),
  tdp: z.coerce.number().int().positive().nullable().optional(),
  pcie_version: z.string().max(10).nullable().optional(),
})

export type GPUSpecsFormData = z.infer<typeof gpuSpecsSchema>

// Combined GPU form
export const gpuFormSchema = z.object({
  component: componentSchema,
  specs: gpuSpecsSchema,
})

export type GPUFormData = z.infer<typeof gpuFormSchema>

// CPU Specs Schema
export const cpuSpecsSchema = z.object({
  chip_series: z.string().max(50).nullable().optional(),
  chip_model: z.string().max(50).nullable().optional(),
  socket_type: z.string().max(50).nullable().optional(),
  cores: z.coerce.number().int().positive().nullable().optional(),
  threads: z.coerce.number().int().positive().nullable().optional(),
  base_clock: z.coerce.number().positive().nullable().optional(),
  boost_clock: z.coerce.number().positive().nullable().optional(),
  tdp: z.coerce.number().int().positive().nullable().optional(),
  integrated_graphics: z.boolean().default(false),
})

export type CPUSpecsFormData = z.infer<typeof cpuSpecsSchema>

// Combined CPU form
export const cpuFormSchema = z.object({
  component: componentSchema,
  specs: cpuSpecsSchema,
})

export type CPUFormData = z.infer<typeof cpuFormSchema>

// RAM Specs Schema
export const ramSpecsSchema = z.object({
  memory_type: z.enum(['DDR4', 'DDR5']).nullable().optional(),
  capacity: z.coerce.number().int().positive().nullable().optional(),
  speed: z.coerce.number().int().positive().nullable().optional(),
  kit_configuration: z.string().max(20).nullable().optional(),
  cas_latency: z.string().max(20).nullable().optional(),
  rgb: z.boolean().default(false),
  voltage: z.coerce.number().positive().nullable().optional(),
})

export type RAMSpecsFormData = z.infer<typeof ramSpecsSchema>

// Combined RAM form
export const ramFormSchema = z.object({
  component: componentSchema,
  specs: ramSpecsSchema,
})

export type RAMFormData = z.infer<typeof ramFormSchema>

// Filter schemas for search/filter functionality
export const componentFilterSchema = z.object({
  category_id: z.string().uuid().optional(),
  brand_id: z.string().uuid().optional(),
  partner_id: z.string().uuid().optional(),
  search: z.string().optional(),
  is_admin_approved: z.boolean().optional(),
})

export type ComponentFilter = z.infer<typeof componentFilterSchema>

// GPU filter with specs
export const gpuFilterSchema = componentFilterSchema.extend({
  vram_size: z.coerce.number().int().positive().optional(),
  vram_type: z.string().optional(),
  min_vram: z.coerce.number().int().positive().optional(),
})

export type GPUFilter = z.infer<typeof gpuFilterSchema>

// RAM filter with specs
export const ramFilterSchema = componentFilterSchema.extend({
  memory_type: z.string().optional(),
  min_capacity: z.coerce.number().int().positive().optional(),
  min_speed: z.coerce.number().int().positive().optional(),
  rgb: z.boolean().optional(),
})

export type RAMFilter = z.infer<typeof ramFilterSchema>
