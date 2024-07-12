import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Badge from "./Badge";
import {
  CartItems,
  decreaseQuantity,
  increaseQuantity,
} from "../app/features/slices/cartSlice";
import { priceTag } from "../utils/priceTag";
import { Tables } from "../database.types";
import Animated, {
  FadeIn,
  FadeOut,
  BounceInRight,
  SlideOutLeft,
  BounceOutLeft,
  SlideInRight,
} from "react-native-reanimated";
import { calcDis } from "../utils/discountCalculator";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "./constants/Colors";

interface CartDetailsProps {
  product?: Tables<"products">;
  totalAmount: number;
  quantity?: number;
  totalItems?: number;
  containerStyles?: string;
  textStyles?: string;
}
const CartDetails = ({
  product,
  totalAmount,
  quantity,
  totalItems,
  containerStyles,
  textStyles,
}: CartDetailsProps) => {
  const [item, setItem] = useState<CartItems | undefined>();
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  useEffect(() => {
    checkIfItemExistInCart();
  }, [cartItems]);
  function checkIfItemExistInCart() {
    const cartItem = cartItems.find((i) => i.id === product?.id);
    if (!cartItem) {
      return;
    }
    setItem(cartItem);
  }

  return (
    <View>
      {product?.discount && (
        <View className="flex-row rounded-full justify-between items-center mt-4 mb-7">
          <Text className="text-secondary  text-xl font-thin text-center ">
            {calcDis(product?.price, product?.discount)}
          </Text>
          {item && (
            <View style={styles.quantitySelector}>
              <TouchableOpacity activeOpacity={0.7}>
                <FontAwesome
                  onPress={() => {
                    dispatch(decreaseQuantity(item));
                  }}
                  name="minus"
                  color="gray"
                  style={{ padding: 5 }}
                />
              </TouchableOpacity>

              {item && <Text style={styles.quantity}>{item.quantity}</Text>}
              <TouchableOpacity activeOpacity={0.7}>
                <FontAwesome
                  onPress={() => dispatch(increaseQuantity(item))}
                  name="plus"
                  color="gray"
                  style={{ padding: 5 }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      <View
        className={`flex-row items-center justify-between flex-wrap gap-2 px-2 ${containerStyles}`}
      >
        {product && (
          <View className="items-center justify-between">
            <Badge
              otherStyles={`bg-white text-xs text-red-500 line-through rounded-t`}
              price={product?.discount as number}
            />
            <Badge
              otherStyles={`bg-secondary text-xs ${
                product.discount ? "rounded-b" : "rounded"
              }`}
              price={product?.price}
            />
          </View>
        )}
        {quantity && <Text className={`${textStyles}`}>Qty: {quantity}</Text>}
        {totalItems! > 0 && (
          <Text className={`${textStyles}`}>Cart: {totalItems}</Text>
        )}

        {totalAmount && (
          <Text className={`${textStyles}`}>
            Total Cart: {priceTag(totalAmount)}
          </Text>
        )}
      </View>
      {product?.description && (
        <Animated.View
          className="w-full mt-4"
          entering={SlideInRight.delay(50)}
        >
          <Text className="text-gray-100">{product?.description}</Text>
        </Animated.View>
      )}
    </View>
  );
};

export default React.memo(CartDetails);
const styles = StyleSheet.create({
  quantitySelector: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  quantity: {
    fontWeight: "500",
    fontSize: 18,
    color: "#ffff",
  },
  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});
