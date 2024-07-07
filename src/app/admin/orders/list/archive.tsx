import { Alert, FlatList } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Loading from "@/src/components/Loading";
import OrderItem from "@/src/components/OrderItem";
import { useAdminOrders } from "@/src/lib/query";
import OrderPlaceholderSkeleton from "@/src/components/OrderPlaceholderSkeleton";

export default function Orders() {
  const { data: orders, error, isLoading } = useAdminOrders(true);
  if (isLoading) {
    return <OrderPlaceholderSkeleton />;
  }
  if (error) {
    return Alert.alert("Error Fetching Order", error.message);
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
