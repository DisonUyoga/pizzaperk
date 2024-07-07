import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";

import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useSegments } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Tables } from "../database.types";

interface OrderProps {
  order: Tables<"orders">;
}

const OrderItem = ({ order }: OrderProps) => {
  const segments = useSegments();

  return (
    <Link href={`/${segments[0]}/orders/${order.id}`} asChild>
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row w-full item-center justify-between p-2 rounded bg-gray-100"
      >
        <View className="flex-col space-y-2">
          <Text className="font-bold text-sm">#{order.id}</Text>
          <Text className="text-xs font-semibold">
            {formatDistanceToNow(order.created_at)}
          </Text>
        </View>
        <View className="flex-row gap-1 items-center">
          {order.status === "DELIVERED" ? (
            <FontAwesome name="check" size={10} color={"green"} />
          ) : order.status === "COOKING" ? (
            <FontAwesome6 name="pizza-slice" size={10} color="black" />
          ) : null}
          <Text
            className={
              order.status === "COOKING"
                ? "text-orange-500"
                : order.status === "DELIVERED"
                ? "text-green-600"
                : order.status === "New"
                ? "text-black-100"
                : order.status === "DELIVERING"
                ? "text-secondary-100"
                : "text-blue-700"
            }
          >
            {order.status}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default OrderItem;
