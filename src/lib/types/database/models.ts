import { Series } from "./series";

export interface Models {
  id: number;
  name: string;
  series_id?: number;
  series?: Series[];
}
