import { Products } from "./products";

export interface CpuVariants {
  id: number;
  product_id: number;
  cores: number;
  threads: number;
  base_clock_ghz: number;
  boost_clock_ghz: number;
  tdp_watts: number;
  socket_type: string;
  products?: Products;
}
