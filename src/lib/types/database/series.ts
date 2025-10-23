import { Vendors } from "./vendors";

export interface Series {
  id: number;
  vendor_id?: number;
  component_id: number;
  name: string;
  vendor?: Vendors[];
}
