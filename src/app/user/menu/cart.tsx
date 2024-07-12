import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Button,
  FlatList,
  PanResponder,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { confirmPayment } from "@stripe/stripe-react-native";
import { Stack, router } from "expo-router";
import CartDetails from "../../../components/CartDetails";
import CartListItem from "../../../components/CartListItem";
import NoItemInCart from "../../../components/NoItemInCart";
import OrderLoading from "../../../components/OrderLoading";
import Skeleton from "../../../components/Skeleton";
import {
  useCreateOrder,
  useCreateOrderItem,
  useStripePayment,
} from "../../../lib/mutate";
import { initializePaymentSheet, openPaymentSheet } from "../../../lib/stripe";
import { InsertTables } from "../../../type";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { toast } from "../../../utils/toast";
import { clearCart } from "../../features/slices/cartSlice";
import { useGetProducts } from "@/src/lib/query";

const cart = () => {
  const [loading, setLoading] = useState(false);
  const { totalAmount, cartItems, totalQuantity } = useAppSelector(
    (state) => state.cart
  );
  const { data, isLoading } = useGetProducts();

  const { mutate: createOrderItem, isPending: orderItemPending } =
    useCreateOrderItem();
  const [clientSecret, setClientSecret] = useState<string>();
  const { user } = useAppSelector((state) => state.auth);
  const [stripeUser, setStripeUser] = useState<Object | undefined>();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const {
    mutate: createStripe,
    data: paymentIntentData,
    isPending: stripePending,
  } = useStripePayment();
  const dispatch = useAppDispatch();
  const user_id = user?.user.id;

  if (!cartItems.length) {
    return <NoItemInCart />;
  }
  if (loading) {
    return <OrderLoading />;
  }
  if (isPending || stripePending || isLoading) {
    return <Skeleton item={cartItems} />;
  }

  const handleCreateOrder = () => {
    createOrder(
      { total: totalAmount, user_id },
      {
        onSuccess: (order) => {
          getClientSecret(order);
        },
      }
    );
  };

  function getClientSecret(order: InsertTables<"orders">) {
    try {
      const data = {
        user: user?.user.email,
        amount: totalAmount,
      };
      const url = "/api/v1/stripe/";
      const method = "POST";
      createStripe(
        { url, data, method },
        {
          onSuccess: async (res: any) => {
            setClientSecret(res.client_secret);

            checkout(res.client_secret, user?.user.email as string, order);
          },
        }
      );
    } catch (error) {}
  }

  async function checkout(
    client_secret: string,
    user: string,
    order: InsertTables<"orders">
  ) {
    await initializePaymentSheet(client_secret, user);

    const pay = await openPaymentSheet();

    if (!pay) {
      toast("payment not successfull", "error");
      return;
    }
    // confirm the payment was made

    handleConfirmPayment(client_secret as string, order);
  }

  // payment confirmation function to be implemented in production
  const handleConfirmPayment = async (
    client_secret: string,
    order: InsertTables<"orders">
  ) => {
    const { error, paymentIntent } = await confirmPayment(
      client_secret as string
    );

    // if (error) {
    //   console.log(error.message);
    //   Alert.alert(`Error: ${error.message}`);
    // } else if (paymentIntent) {
    //   toast("payment successfull", "green");
    //   handleCreateOrderItem(dataItem);
    // }

    toast(
      "Payment successfull, Your order is placed, please wait while we locate you with your order",
      "success"
    );
    setLoading(true);
    handleCreateOrderItem(order);
  };

  const handleCreateOrderItem = (order: InsertTables<"orders">) => {
    createOrderItem(
      { items: cartItems, order_id: order.id as number },
      {
        onSuccess: (_, item) => {
          dispatch(clearCart());
          setLoading(false);
          router.push(`/user/orders/${order.id}?payment=true`);
        },
      }
    );
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1  bg-primary px-4">
      <Stack.Screen options={{ headerTintColor: "#fff" }} />
      <View>
        <FlatList
          data={cartItems}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <CartListItem cartItem={item} dataItem={data as any} />
          )}
          ListFooterComponent={() => (
            <View>
              <CartDetails
                quantity={totalQuantity}
                totalAmount={totalAmount}
                containerStyles="mt-4 bg-primary p-4 rounded"
                textStyles="font-bold text-gray-100"
              />

              {loading ? (
                <ActivityIndicator />
              ) : (
                <View className="w-full  mb-4">
                  <Button
                    testID="testing checkout press"
                    title="Checkout"
                    color="green"
                    onPress={handleCreateOrder}
                  />
                </View>
              )}
            </View>
          )}
          contentContainerStyle={{ gap: 10 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default cart;
