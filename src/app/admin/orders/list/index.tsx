import { Alert, FlatList } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Loading from "@/src/components/Loading";
import OrderItem from "@/src/components/OrderItem";
import { useAdminOrders } from "@/src/lib/query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useSubscription } from "@/src/utils/useSubscriptions";
import OrderPlaceholderSkeleton from "@/src/components/OrderPlaceholderSkeleton";
import NoItemInCart from "@/src/components/NoItemInCart";
export default function Orders() {
  const orderItemSubscription = useSubscription();
  const { data: orders, error, isLoading, isFetched } = useAdminOrders();
  // subscribe to the order insert channel for real time status update
  useSubscription();
  if (isLoading) {
    return <OrderPlaceholderSkeleton />;
  }
  if (error) {
    return Alert.alert("Error Fetching Order", error.message);
  }
  if (!isFetched) {
    return (
      <NoItemInCart
        text="There are no orders at the moment!!!"
        title="Go to Dashboard"
      />
    );
  }
  return (
    <SafeAreaView className="bg-primary px-4 flex-1">
      <Stack.Screen options={{ title: "Active" }} />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderItem order={item} />}
        contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
      />
    </SafeAreaView>
  );
}
