import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React, { memo, useRef } from "react";
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

  if (product.categories) {
    categoryRef.current = product.categories;
  }

  const category = _.truncate(categoryRef.current.category as string, {
    separator: " ",
    length: 20,
  });

  if (product?.discount) {
    checkDiscountRef.current = product?.discount > product?.price;
  }

  return (
    <Link href={`/${segments[0]}/menu/${product?.id}`} asChild>
      <TouchableOpacity
        className="flex-row space-x-2 bg-card py-2 rounded px-4"
        activeOpacity={0.6}
        onPress={() => {
          if (toggleModal && !isAdmin) {
            toggleModal();
          }
        }}
      >
        <RemoteImage
          fallback={products[0].image}
          path={product.image as string}
        />

        <View className="space-y-2 w-4/6">
          <View className="space-y-2 w-full">
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
              {checkDiscountRef.current && (
                <View className="flex-row">
                  <Text className="text-xl text-secondary font-thin">
                    {calcDis(product.price, product.discount as number)}
                  </Text>
                  <Text className="text-secondary-100 font-thin text-xs ">
                    off
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
