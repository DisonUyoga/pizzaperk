import products, { sizes } from "@/assets/data/products";

import CartDetails from "@/src/components/CartDetails";
import ProductDetailImage from "@/src/components/ProductDetailImage";
import ProductDetailSkeletonPlaceholder from "@/src/components/ProductDetailSkeletonPlaceholder";
import SelectSize from "@/src/components/SelectSize";
import { Tables } from "@/src/database.types";
import { useGetProduct } from "@/src/lib/query";
import { useAppDispatch, useAppSelector } from "@/src/utils/hooks";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import {
  CartItems,
  addToCart,
  selectSize,
  updateCartTotalAfterSizeChange,
} from "../../features/slices/cartSlice";
import { FontAwesome } from "@expo/vector-icons";
import ZoomImageDetailModal from "@/src/components/ZoomImageDetailModal";
import { StatusBar } from "expo-status-bar";
import { PizzaSize } from "@/src/type";
import { setProduct } from "../../features/slices/productSlice";

const ProductDetail = () => {
  const { id, update } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectionLoader, setSelectionLoader] = useState(false);
  const { data: product, error, isLoading } = useGetProduct(id as string);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    totalAmount,
    totalQuantity,
    sizes: selected,
  } = useAppSelector((state) => state.cart);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const [cartProduct, setCartProduct] = useState<CartItems | undefined>();
  const [openZoom, setOpenZoom] = useState(false);
  const [priceSize, setPriceSize] = useState<number | null>(null);

  useEffect(() => {
    if (cartItems) {
      checkIfItemIsAlreadyInTheCart(cartItems);
    }
    if (cartItems && cartProduct) {
      changeCartTotalWhenSizeIsChanged(cartItems);
    }
  }, [cartItems]);
  useEffect(() => {
    handleSelected(selected);
    if (product) {
      dispatch(setProduct({ product }));
    }
  }, [product]);

  const handleSelected = (size: PizzaSize) => {
    setSelectionLoader(true);
    try {
      if (!product) return;
      dispatch(selectSize({ size, product }));

      updateSize();

      togglePriceDependingOnTheSize(product, size);
    } catch (error) {
    } finally {
      setSelectionLoader(false);
    }
  };

  function checkIfItemIsAlreadyInTheCart(c: CartItems[]) {
    const cartItem = cartItems.find((p) => p.id === product?.id) as CartItems;

    if (!cartItem || !product) return;

    setCartProduct(cartItem);
  }
  function togglePriceDependingOnTheSize(
    product: Tables<"products">,
    selectedSize: PizzaSize
  ) {
    switch (selectedSize) {
      case "S":
        setPriceSize(product.size_small);

        break;
      case "M":
        setPriceSize(product.size_medium);

        break;
      case "L":
        setPriceSize(product.size_large);
        setSelectionLoader(false);

        break;
      default:
        setPriceSize(product.price);
    }
  }
  function changeCartTotalWhenSizeIsChanged(c: CartItems[]) {
    setSelectionLoader(true);
    const item = c.find((p) => p.id === product?.id);

    if (!item) return;

    if (priceSize && item?.price) {
      const newTotal =
        totalAmount - item?.quantity * item.price + item.quantity * priceSize;

      dispatch(
        updateCartTotalAfterSizeChange({
          newTotal,
          changedItem: product,
          price: priceSize,
        })
      );
    }
    setSelectionLoader(false);
  }
  if (isLoading) {
    return <ProductDetailSkeletonPlaceholder />;
  }
  if (error) {
    return;
  }

  function updateSize() {
    if (update && cartItems && cartProduct) {
      changeCartTotalWhenSizeIsChanged(cartItems);
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

      router.push(`/user/menu/cart?isPizza=${determineIfItemIsPizza}`);
    } catch (error: any) {
      Alert.alert("Error", error);
    } finally {
      setLoading(false);
    }
  }
  function toggleZoom() {
    setOpenZoom(!openZoom);
  }
  const determineIfItemIsPizza =
    product?.size_large || product?.size_medium || product?.size_small;
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
              headerShown: true,
              headerTitleStyle: {
                color: "#ffff",
                fontWeight: "300",
              },
            }}
          />
          <View className="w-full relative mb-4">
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
              quantity={cartProduct?.quantity}
              totalAmount={totalAmount}
              textStyles="text-gray-100 text-xs font-bold"
              selected={selected}
              priceSize={priceSize}
            />
          )}
          <View className="flex-row w-full bg-transparent items-start justify-between mt-7 mb-7 relative">
            {determineIfItemIsPizza &&
              sizes.map((item) => (
                <SelectSize
                  key={item}
                  sizes={item}
                  handleSelected={handleSelected}
                  selected={selected}
                />
              ))}
            {selectionLoader && (
              <View className="absolute w-full items-center -top-8">
                <ActivityIndicator color={"yellow"} />
              </View>
            )}
          </View>

          {product && (
            <View className={` mb-4 ${!determineIfItemIsPizza && "mt-7"}`}>
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

      <StatusBar backgroundColor="#161622" style="light" />
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
