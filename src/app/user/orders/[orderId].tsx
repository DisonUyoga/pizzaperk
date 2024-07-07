import GrowingLoader from "@/src/components/GrowingLoader";
import Loading from "@/src/components/Loading";
import OrderDetails from "@/src/components/OrderDetails";
import OrderListItem from "@/src/components/OrderItem";
import OrderLoading from "@/src/components/OrderLoading";
import OrderPlaceholderSkeleton from "@/src/components/OrderPlaceholderSkeleton";
import Skeleton from "@/src/components/Skeleton";
import { Tables } from "@/src/database.types";
import { useOrderDetails } from "@/src/lib/query";
import { useAppDispatch, useAppSelector } from "@/src/utils/hooks";
import {
  useSubscription,
  useUpdateSubscription,
} from "@/src/utils/useSubscriptions";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OrderDetailProps {
  orderItem: Tables<"orders">;
}
const OrderDetail = () => {
  const { orderId, payment } = useLocalSearchParams()!;
  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const { data: order, error, isLoading } = useOrderDetails(orderId as string);
  useUpdateSubscription(orderId as string);

  if (isLoading && payment === "true") {
    return <OrderLoading />;
  }
  if (isLoading) {
    return <OrderPlaceholderSkeleton />;
  }
  if (error) {
    return Alert.alert("Error Fetching Order Detail", error.message);
  }

  return (
    <SafeAreaView className="bg-primary px-4 flex-1">
      <Stack.Screen options={{ title: `#${orderId}` }} />
      <View className="mb-2">
        <Text className="text-white mb-2">Order Item</Text>
        {order && <OrderListItem order={order} />}
      </View>
      {order?.order_items && (
        <FlatList
          data={order?.order_items}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }: any) => <OrderDetails order={item} />}
          contentContainerStyle={{ gap: 10 }}
        />
      )}
    </SafeAreaView>
  );
};

export default OrderDetail;
