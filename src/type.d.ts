import { ImagePickerAsset } from "expo-image-picker";
import { FormikState } from "formik";
import { Database } from "./database.types";
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Databse["public"]["Enums"][T];

export type PizzaSize = "S" | "M" | "L" | "XL";

export type CartItem = {
  id: string;
  product: Product;
  product_id: number;
  size: PizzaSize;
  quantity: number;
};

export const OrderStatusList: OrderStatus[] = [
  "New",
  "Cooking",
  "Delivering",
  "Delivered",
];

export type OrderStatus = "New" | "COOKING" | "DELIVERING" | "DELIVERED";

export type Order = {
  id: number;
  created_at: string;
  total: number;
  user_id: string;
  status: OrderStatus;

  order_items?: OrderItem[];
};

export type OrderItem = {
  id: number;
  product_id: number;
  products: Product;
  order_id: number;
  size: PizzaSize;
  quantity: number;
};

export type Profile = {
  id: string;
  group: string;
};

interface CreateType {
  name: string;
  image: string | null;
  price: number | null;
}
interface UpdateType {
  id: string;
  name: string;
  image: string | null;
  price: number | null;
}
interface ResetFormType {
  resetForm: (nextState?: Partial<FormikState<any>> | undefined) => void;
}
declare module "yup" {
  interface StringSchema<TType, TContext, TDefault, TFlags> {
    append(appendStr: string): this;
  }
}
export interface UserType {
  phone?: string;
  password: string;
  email?: string;
}
export interface ResetFormType {
  resetForm: (nextState?: Partial<FormikState<UserType>> | undefined) => void;
}

export interface StripeResponse{
  username: string
  email?: string
}

