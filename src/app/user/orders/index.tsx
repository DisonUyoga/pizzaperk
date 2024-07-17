import { Alert, FlatList, StyleSheet } from "react-native";

import EditScreenInfo from "@/src/components/EditScreenInfo";
import { Text, View } from "@/src/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import orders from "@/assets/data/orders";
import { Order } from "@/src/type";
import OrderItem from "@/src/components/OrderItem";
import { useAppSelector } from "@/src/utils/hooks";
import { useOrders } from "@/src/lib/query";
import Loading from "@/src/components/Loading";
import {
  useSubscription,
  useUpdateSubscription,
} from "@/src/utils/useSubscriptions";
import OrderPlaceholderSkeleton from "@/src/components/OrderPlaceholderSkeleton";
import { Stack } from "expo-router";
import NoItemInCart from "@/src/components/NoItemInCart";

export default function Orders() {
  const { user } = useAppSelector((state) => state.auth);
  const {
    data: orders,
    error,
    isLoading,
    isFetched,
  } = useOrders(user?.user.id as string);
  // subscribe to insert event for realtime update

  useSubscription();
  if (isLoading) {
    return <OrderPlaceholderSkeleton />;
  }
  if (error) {
    return Alert.alert("Order Fetch Error", error.message);
  }
  if (!isFetched) {
    return (
      <NoItemInCart
        text="You have not placed any order!!!"
        title="place and order"
      />
    );
  }

  return (
    <SafeAreaView className="bg-primary px-4 flex-1">
      <Stack.Screen
        options={{
          title: "Orders",
          headerShown: true,
          headerTitleStyle: {
            color: "#ffff",
            fontWeight: "300",
          },
        }}
      />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderItem order={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
    </SafeAreaView>
  );
}
