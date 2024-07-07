import { View, Text } from "react-native";
import React from "react";
import Badge from "./Badge";
import { CartItems } from "../app/features/slices/cartSlice";
import { priceTag } from "../utils/priceTag";
interface CartDetailsProps {
  price?: number;
  totalAmount: number;
  quantity?: number;
  totalItems?: number;
  containerStyles?: string;
  textStyles?: string;
}
const CartDetails = ({
  price,
  totalAmount,
  quantity,
  totalItems,
  containerStyles,
  textStyles,
}: CartDetailsProps) => {
  return (
    <View
      className={`flex-row items-center justify-between flex-wrap gap-2 px-2 ${containerStyles}`}
    >
      {price && <Badge price={price} />}
      {quantity && (
        <Text className={`${textStyles}`}>Quantity: {quantity}</Text>
      )}
      {totalItems! > 0 && (
        <Text className={`${textStyles}`}>Cart Total: {totalItems}</Text>
      )}

      {totalAmount && (
        <Text className={`${textStyles}`}>
          Total Cart: {priceTag(totalAmount)}
        </Text>
      )}
    </View>
  );
};

export default React.memo(CartDetails);
