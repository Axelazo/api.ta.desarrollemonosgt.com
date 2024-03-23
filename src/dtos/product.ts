export type CreateProductDTO = {
  name: string;
  description: string;
  price: number;
  stock: number;
  warehouseId: number;
  userId: number;
};

export type UpdateProductDTO = {
  name: string;
  description: string;
  price: number;
};
