export interface Budget {
  id: string;
  client: string;
  title: string;
  items: Item[];
  status: string;
  createdAt: string;
  updatedAt: string;
  discount?: number;
}

export interface Item {
  id: string;
  description: string;
  detail: string;
  qty: number;
  price: number;
}
