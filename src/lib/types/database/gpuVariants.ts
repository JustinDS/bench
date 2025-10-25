import { Products } from "./products";

export interface GpuVariants {
  id: number;
  product_id: number;
  memory_type: string;
  vram_gb: number;
  core_clock_mhz: number;
  boost_clock_mhz: number;
  power_draw_watts: number;
  products?: Products;
}
