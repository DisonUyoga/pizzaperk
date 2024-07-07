import { View, Text, FlatList, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import orders from "@/assets/data/orders";

import { SafeAreaView } from "react-native-safe-area-context";
import OrderDetails from "@/src/components/OrderDetails";
import OrderListItem from "@/src/components/OrderItem";
import Status from "@/src/components/Status";
import { Order, OrderStatus } from "@/src/type";
import { useOrderDetails } from "@/src/lib/query";
import Loading from "@/src/components/Loading";
import { Tables } from "@/src/database.types";
import { useCreateOrderItem, useUpdateOrder } from "@/src/lib/mutate";
import { toast } from "@/src/utils/toast";
import { useUpdateSubscription } from "@/src/utils/useSubscriptions";
import { notifyUserAboutOrder } from "@/src/lib/notification";
import OrderPlaceholderSkeleton from "@/src/components/OrderPlaceholderSkeleton";
import registerNNPushToken from "native-notify";

interface OrderDetailProps {
  orderItem: Tables<"order_items">;
}
export const OrderStatusList: OrderStatus[] = [
  "New",
  "COOKING",
  "DELIVERING",
  "DELIVERED",
];

const OrderDetail = () => {
  const { orderId } = useLocalSearchParams()!;
  const { data: order, error, isLoading } = useOrderDetails(orderId as string);
  const { mutate: updateStatus, isPending } = useUpdateOrder();
  const [selected, setSelected] = useState<Tables<"orders"> | string>(
    order?.status ?? "New"
  );
  useUpdateSubscription(orderId as string);
  if (isLoading) {
    return <OrderPlaceholderSkeleton />;
  }
  if (error) {
    return Alert.alert("Error Fetch Order Details", error.message);
  }

  const handleSelected = async (status: OrderStatus) => {
    setSelected(status);

    if (!order) return;

    updateStatus(
      {
        updatedFields: { status },
        id: orderId as string,
      },
      {
        onSuccess: async (updatedOrder: any) => {
          toast("order status updated", "success");
          await notifyUserAboutOrder(order, status);
        },
      }
    );
  };
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
          ListFooterComponent={() => (
            <ScrollView horizontal className="mt-2">
              <View className="flex-row">
                {OrderStatusList.map((s) => (
                  <Status
                    key={s}
                    status={s}
                    handleSelected={handleSelected}
                    selected={selected as any}
                  />
                ))}
              </View>
            </ScrollView>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default OrderDetail;
