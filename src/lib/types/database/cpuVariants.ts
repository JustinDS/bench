import { Products } from "./products";

export interface CpuVariants {
  id: number;
  product_id: number;
  p_cores: number;
  p_threads: number;
  e_cores: number;
  e_threads: number;
  base_clock_ghz: number;
  boost_clock_ghz: number;
  tdp_watts: number;
  socket_type: string;
  products?: Products;
}
