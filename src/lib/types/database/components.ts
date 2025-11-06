export interface Components {
  id: number;
  name: string;
}

export enum ComponentType {
  UNKNOWN = 0,
  CPU = 1,
  GPU = 2,
  RAM = 3,
  COOLER = 4,
  MOTHERBOARD = 5,
}
