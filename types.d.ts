export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  imageUrl: string;
  inStock: boolean;
  quantity: number;
  tags: string[];
  rating?: number;
  releaseDate: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: string;
  currency: string;
  category: string;
  imageUrl: string;
  inStock: boolean;
  quantity: string;
  tags: string;
}

export type Filter = {
  category?: string;
  name?: string;
  tag?: string;
};



export interface Activity {
  id: string;
  type: 'order' | 'product';
  action: string;
  userName: string;
  userEmail: string;
  details: {
    total?: number;
    items?: string;
    status?: string;
    name?: string;
    price?: number;
    category?: string;
  };
  createdAt: string;
}

export interface OrderItem {
  id?: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  productName?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  total: number;
  createdAt: string;
  status: "PENDING" | "PAID" | "CANCELLED" | "SHIPPED";
  items: OrderItem[];
}