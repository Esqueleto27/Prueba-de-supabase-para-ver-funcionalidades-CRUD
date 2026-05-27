export interface Car {
  id: string;
  name: string;
  brand: string;
  color: string;
  year: number;
  price: number | null;
  description: string | null;
  images: string[];
  created_at: string;
}

export type CarInsert = Omit<Car, "id" | "created_at">;
