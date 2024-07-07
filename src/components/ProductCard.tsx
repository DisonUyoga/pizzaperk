import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import { OrderItem } from "../type";
import { Image } from "expo-image";
import Badge from "./Badge";
import * as Animatable from "react-native-animatable";
import { Link, useRouter, useSegments } from "expo-router";
import Button from "./Button";
import { addToCart } from "../app/features/slices/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "../utils/toast";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import products from "@/assets/data/products";
import { StyleSheet } from "react-native";
import { blurhash } from "@/assets/data/products";
import { Tables } from "../database.types";
import RemoteImage from "./RemoteImage";
import _ from "lodash";
import { calcDis } from "../utils/discountCalculator";

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
}
const ProductCard = ({
  product,
  otherStyles,
  containerStyle,
  animateItem,
}: ProductProps) => {
  const dispatch = useAppDispatch();
  const { sizes: size } = useAppSelector((state) => state.cart);
  const router = useRouter();
  const segments = useSegments();
  function addProductToCart(product: Tables<"products">) {
    if (!product) return;
    dispatch(addToCart({ product, size }));

    toast("item added to cart", "success");

    // router.push("/cart");
  }
  const description = _.truncate(product.description as string, {
    separator: " ",
    length: 30,
  });
  const name = _.truncate(product.name as string, {
    separator: " ",
    length: 25,
  });

  return (
    <Link href={`/${segments[0]}/menu/${product?.id}`} asChild>
      <TouchableOpacity
        className="flex-row space-x-2 bg-card py-2 rounded "
        activeOpacity={0.6}
      >
        <RemoteImage
          fallback={products[0].image}
          path={product.image as string}
        />

        <View className="space-y-2">
          <View className="space-y-2">
            <Text className=" text-white font-bold text-sm">{name}</Text>
            <View className="flex-row  justify-between gap-x-4">
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
              {product.discount && (
                <Text className="text-xl text-secondary font-thin">
                  {calcDis(product.price, product.discount as number)}
                </Text>
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
