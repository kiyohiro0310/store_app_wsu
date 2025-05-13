export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
  rating?: number;
  tags: string[];
  orderId?: string;
};

export type Filter = {
  category?: string;
  name?: string;
  tag?: string;
};

export type OrderItem = {
  id?: string;
  orderId: string;
  pricePurchase: double;
  productId: string;
  quantity: number;
}
