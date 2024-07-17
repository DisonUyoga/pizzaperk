import { Alert, FlatList } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import NoItemInCart from "@/src/components/NoItemInCart";
import OrderItem from "@/src/components/OrderItem";
import OrderPlaceholderSkeleton from "@/src/components/OrderPlaceholderSkeleton";
import { useAdminOrders } from "@/src/lib/query";

export default function Orders() {
  const { data: orders, error, isLoading, isFetched } = useAdminOrders(true);
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
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderItem order={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
    </SafeAreaView>
  );
}
