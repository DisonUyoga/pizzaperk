import { useQuery } from "@tanstack/react-query";
import {
  getAdminOrders,
  getCategories,
  getDelivery,
  getOrder,
  getOrderItem,
  getOrders,
  getProduct,
  getProducts,
  getStripeUser,
} from "./api";

export function useGetProducts() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  return { data, isLoading, error };
}
export function useGetCategories() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  return { data, isLoading, error };
}

export function useGetProduct(id: string | undefined) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id as string),
  });

  return { data, isLoading, error };
}

export function useOrders(id: string) {
  return useQuery({
    queryKey: ["orders", { userId: id }],
    queryFn: () => getOrders(id),
  });
}

export function useAdminOrders(archived = false) {
  return useQuery({
    queryKey: ["orders", { archived }],
    queryFn: () => getAdminOrders(archived),
  });
}

export function useOrderDetails(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(id),
  });
}
export function useGetStripeUser(url: string) {
  return useQuery({
    queryKey: ["stripe_user"],
    queryFn: () => getStripeUser(url),
  });
}

export function useGetDelivery() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["delivery"],
    queryFn: () => getDelivery(),
  });

  return { data, isLoading, error };
}
