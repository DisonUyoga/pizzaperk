import products from "@/assets/data/products";
import { Link, useRouter, useSegments } from "expo-router";
import _ from "lodash";
import React, { memo, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { addToCart } from "../app/features/slices/cartSlice";
import { Tables } from "../database.types";
import { calcDis } from "../utils/discountCalculator";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { toast } from "../utils/toast";
import Badge from "./Badge";
import RemoteImage from "./RemoteImage";

const zoomIn: any = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};
const zoomOut: any = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

interface ProductProps {
  product: Tables<"products">;
  otherStyles?: string;
  containerStyle?: string;
  animateItem?: string;
  toggleModal?: () => void;
}
const ProductCard = ({
  product,
  otherStyles,
  containerStyle,
  animateItem,
  toggleModal,
}: ProductProps) => {
  const dispatch = useAppDispatch();
  const { sizes: size } = useAppSelector((state) => state.cart);
  const { isAdmin } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const segments = useSegments();
  const categoryRef = useRef<any>();
  const checkDiscountRef = useRef(false);
  function addProductToCart(product: Tables<"products">) {
    if (!product) return;
    dispatch(addToCart({ product, size }));

    toast("item added to cart", "success");
  }
  const description = _.truncate(product.description as string, {
    separator: " ",
    length: 30,
  });
  const name = _.truncate(product.name as string, {
    separator: " ",
    length: 25,
  });

  if (product?.discount) {
    checkDiscountRef.current = product?.discount > product?.price;
  }

  return (
    <Link href={`/${segments[0]}/menu/${product?.id}`} asChild>
      <TouchableOpacity
        className="flex-row space-x-6 bg-card py-4 rounded px-4"
        activeOpacity={0.6}
        onPress={() => {
          if (toggleModal) {
            toggleModal();
          }
        }}
      >
        <RemoteImage
          fallback={products[0].image}
          path={product.image as string}
        />

        <View className="space-y-2 ">
          <View className="space-y-2 w-full">
            <Text className=" text-white font-bold text-sm">{name}</Text>

            <View className="flex-row  justify-between space-x-6">
              <View className="">
                {product?.discount && (
                  <Badge
                    otherStyles={`bg-white text-xs text-red-500 line-through rounded-t`}
                    price={product?.discount as number}
                  />
                )}
                <Badge
                  otherStyles={`bg-secondary text-xs ${
                    product.discount ? "rounded-b" : "rounded"
                  }`}
                  price={product?.price}
                />
              </View>
              {checkDiscountRef.current && (
                <View className="flex-row">
                  <Text className="text-xl text-secondary font-thin">
                    {calcDis(product.price, product.discount as number)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {description && (
            <View>
              <Text className="text-gray-100 text-xs" numberOfLines={2}>
                {description}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default memo(ProductCard);

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
