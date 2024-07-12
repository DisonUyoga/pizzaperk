import products, { sizes } from "@/assets/data/products";

import CartDetails from "@/src/components/CartDetails";
import ProductDetailImage from "@/src/components/ProductDetailImage";
import ProductDetailSkeletonPlaceholder from "@/src/components/ProductDetailSkeletonPlaceholder";
import SelectSize from "@/src/components/SelectSize";
import { Tables } from "@/src/database.types";
import { useGetProduct } from "@/src/lib/query";
import { useAppDispatch, useAppSelector } from "@/src/utils/hooks";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "../../../utils/toast";
import { addToCart, selectSize } from "../../features/slices/cartSlice";
import { FontAwesome } from "@expo/vector-icons";
import ZoomImageDetailModal from "@/src/components/ZoomImageDetailModal";

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
  const cartItem = cartItems.find((p) => p.id === product?.id) as any;
  const [openZoom, setOpenZoom] = useState(false);

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
      router.push("/user/menu/cart");
    }
  }

  function addProductToCart(product: Tables<"products">) {
    if (!product) return;
    try {
      setLoading(true);
      dispatch(addToCart({ product, size: selected }));
      setLoading(false);
      toast("item added to cart", "success");

      router.push("/user/menu/cart");
    } catch (error: any) {
      Alert.alert("Error", error);
    } finally {
      setLoading(false);
    }
  }
  function toggleZoom() {
    setOpenZoom(!openZoom);
  }
  return (
    <SafeAreaView className="bg-primary flex-1 px-4">
      <ScrollView
        className="flex-1  space-y-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-transparent w-full relative">
          <Stack.Screen
            options={{
              title: product && `${product.name}`,
            }}
          />
          <View className="w-full relative">
            <ProductDetailImage
              fallback={products[0].image}
              path={product?.image as string}
            />
            <TouchableOpacity
              className="absolute right-5 top-4"
              onPress={() => toggleZoom()}
            >
              <FontAwesome name="search-plus" size={28} color={"#fff"} />
            </TouchableOpacity>
          </View>

          {product && (
            <CartDetails
              product={product}
              quantity={cartItem?.quantity}
              totalAmount={totalAmount}
              textStyles="text-gray-100 text-xs font-bold"
            />
          )}
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

          {product && (
            <View className="mt-7 mb-4">
              {loading ? (
                <View className="items-center justify-center bg-transparent">
                  <ActivityIndicator />
                </View>
              ) : (
                <Button
                  title="add to cart"
                  color="#FF9001"
                  disabled={loading}
                  onPress={() => {
                    setLoading(true);
                    addProductToCart(product);
                  }}
                />
              )}
            </View>
          )}
        </View>
        {product && (
          <ZoomImageDetailModal
            toggleZoom={toggleZoom}
            openZoom={openZoom}
            product={product}
          />
        )}
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
