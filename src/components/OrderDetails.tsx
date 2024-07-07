import { View, Text } from "react-native";
import React from "react";
import { InsertTables, OrderItem, Tables } from "../type";
import products from "@/assets/data/products";
import { priceTag } from "../utils/priceTag";
import { Image } from "expo-image";
import { blurhash } from "@/assets/data/products";
import CartImage from "@/components/CartImage";

type OrderProps = {};

export interface OrderDetailsProps {
  order: { products: Tables<"products"> } & Tables<"order_items">;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const product = products.find((item) => item.id === order.product_id);

  return (
    <View className="flex-1 item-center p-2 rounded bg-secondary justify-between space-y-2 flex-row">
      <CartImage
        fallback={products[0].image}
        path={order.products.image as string}
      />

      <Text className="font-bold text-white">
        {priceTag(order.products.price)}
      </Text>
      <View className="items-center justify-between px-2">
        <Text className=" font-semibold text-sm">Size: {order?.size}</Text>
        <Text className=" font-semibold text-sm">
          Quantity: {order?.quantity}
        </Text>
      </View>
    </View>
  );
};

export default OrderDetails;
