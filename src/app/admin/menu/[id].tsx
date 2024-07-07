import products, { blurhash, sizes } from "@/assets/data/products";

import CartDetails from "@/src/components/CartDetails";
import Loading from "@/src/components/Loading";
import SelectSize from "@/src/components/SelectSize";
import { Tables } from "@/src/database.types";
import { useGetProduct } from "@/src/lib/query";
import { useAppDispatch, useAppSelector } from "@/src/utils/hooks";
import { Image } from "expo-image";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "../../../utils/toast";
import { addToCart, selectSize } from "../../features/slices/cartSlice";
import RemoteImage from "@/src/components/RemoteImage";
import ProductDetailImage from "@/src/components/ProductDetailImage";
import Skeleton from "@/src/components/Skeleton";
import ProductDetailSkeletonPlaceholder from "@/src/components/ProductDetailSkeletonPlaceholder";
import { FontAwesome } from "@expo/vector-icons";

const ProductDetail = () => {
  const { id, update } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const { data: product, error, isLoading } = useGetProduct(id as string);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    totalAmount,
    totalQuantity,
    sizes: selected,
  } = useAppSelector((state) => state.cart);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const cartItem = cartItems.find((p) => p.id === product?.id);

  if (isLoading) {
    return <ProductDetailSkeletonPlaceholder />;
  }
  if (error) {
    return;
  }
  const handleSelected = (size: string) => {
    if (!product) return;
    dispatch(selectSize({ size, product }));
    updateSize();
  };
  function updateSize() {
    if (update) {
      router.push("/cart");
    }
  }

  function addProductToCart(product: Tables<"products">) {
    if (!product) return;
    try {
      setLoading(true);
      dispatch(addToCart({ product, size: selected }));
      setLoading(false);
      toast("item added to cart", "green");

      router.push("/cart");
    } catch (error: any) {
      Alert.alert("Error", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary flex-1 px-4 ">
      <ScrollView className="flex-1 space-y-6">
        <Stack.Screen
          options={{
            title: product ? `${product.name}` : "",
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#161622",
            },
            headerTitleStyle: {
              color: "#ffff",
              fontWeight: "300",
            },

            headerRight: () => (
              <Link href={`/admin/menu/create/?id=${id}`} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <View className="relative">
                      <FontAwesome
                        name="pencil"
                        size={25}
                        color={"#fff"}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    </View>
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <View className="bg-transparent w-full">
          <Stack.Screen
            options={{
              title: product && `${product.name}`,
            }}
          />
          <ProductDetailImage
            fallback={products[0].image}
            path={product?.image as string}
          />

          <View className="flex-row w-full bg-transparent items-start justify-between mt-7 mb-7">
            {sizes.map((item) => (
              <SelectSize
                key={item}
                sizes={item}
                handleSelected={handleSelected}
                selected={selected}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;
const styles = StyleSheet.create({
  image: {
    width: "100%",
    aspectRatio: 1,
  },
});
