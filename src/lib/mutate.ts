import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateType, InsertTables, UpdateTables, UpdateType } from "../type";
import {
  createCategory,
  createDelivery,
  createOrder,
  createOrderItem,
  createProduct,
  deleteCategory,
  deleteProduct,
  getOrderUpdate,
  getStripe,
  updateProduct,
} from "./api";

import { globalError } from "../app/features/slices/productSlice";
import { store } from "../app/features/store";
import { RequestParameters } from "./axiosInstance";
import { Tables } from "../database.types";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertTables<"products">) => createProduct(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      store.dispatch(globalError({ error: error.message }));
    },
  });
}
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertTables<"categories">) => createCategory(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      store.dispatch(globalError({ error: error.message }));
    },
  });
}
export function useCreateDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (delivery: InsertTables<"delivery">) =>
      createDelivery(delivery),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["delivery"] });
    },
    onError: (error) => {
      store.dispatch(globalError({ error: error.message }));
    },
  });
}
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertTables<"products">) => updateProduct(data),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
    onError: (error) => {
      store.dispatch(globalError({ error: error.message }));
    },
  });
}
export function useDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });
}
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertTables<"orders">) => createOrder(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      store.dispatch(globalError({ error: error.message }));
    },
  });
}

export function useCreateOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      items,
      order_id,
    }: {
      items: InsertTables<"order_items">[];
      order_id: number;
    }) => createOrderItem(items, order_id),
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      updatedFields,
      id,
    }: {
      updatedFields: UpdateTables<"orders">;
      id: string;
    }) => getOrderUpdate({ updatedFields, id }),
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", data.id] });
    },
  });
}

export function useStripePayment() {
  return useMutation({
    mutationFn: ({ url, data, method }: RequestParameters) =>
      getStripe({ url, data, method }),
    onError: (error) => {
      console.log(error);
    },
  });
}
