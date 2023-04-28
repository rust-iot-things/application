export interface Measurements {
  Value: number;
  Timestamp: string;
}

export default interface Temperatures {
  id: number;
  Measurements: Measurements[];
}
