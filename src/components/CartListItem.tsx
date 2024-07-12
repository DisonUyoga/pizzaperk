import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Colors from "./constants/Colors";
import { Image } from "expo-image";
// import { CartItem } from "../types";
import { Link, Stack, useSegments } from "expo-router";
// import { defaultPizzaImage } from "../../../constants/Images";
import { FontAwesome } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import {
  CartItems,
  increaseQuantity,
  decreaseQuantity,
  updateCartTotalAfterSizeChange,
} from "../app/features/slices/cartSlice";
import { priceTag } from "../utils/priceTag";
import products from "@/assets/data/products";
import { blurhash } from "@/assets/data/products";
import ProductDetailImage from "./ProductDetailImage";
import RemoteImage from "./RemoteImage";
import CartImage from "./CartImage";
import { Tables } from "../database.types";
import { toast } from "../utils/toast";
interface CartListItemProps {
  cartItem: CartItems;
  dataItem: Tables<"products">[];
}
const CartListItem = ({ cartItem, dataItem }: CartListItemProps) => {
  const { totalQuantity, totalAmount } = useAppSelector((state) => state.cart);
  const [price, setPrice] = useState<number | null>(null);
  const [defaultSize, setDefaultSize] = useState<string | null>(null);
  const [changeTotal, setChangeTotal] = useState<number | null>(totalAmount);
  const dispatch = useAppDispatch();
  const segments = useSegments();

  useEffect(() => {
    changePriceAccordingToSize(cartItem, dataItem);
  }, [cartItem, dataItem]);

  function changePriceAccordingToSize(c: CartItems, p: Tables<"products">[]) {
    const item = p.find((i) => i.id === c.id);
    if (!item) return;
    checkIfSizesExist(item);
    switch (c.size) {
      case "S":
        setPrice(item?.size_small);
        changeTotalAmount(cartItem, item.size_small);

        break;
      case "M":
        setPrice(item.size_medium);
        changeTotalAmount(cartItem, item.size_medium);
        break;
      case "L":
        setPrice(item.size_large);
        changeTotalAmount(cartItem, item.size_large);

        break;
      default:
        setPrice(item.price);
        changeTotalAmount(cartItem, item.price);
    }
  }

  function changeTotalAmount(c: CartItems, p: number | null) {
    if (!p) return;
    const newTotal = totalAmount - c.price * c.quantity + p * c.quantity;

    dispatch(
      updateCartTotalAfterSizeChange({ newTotal, changedItem: c, price: p })
    );
    setChangeTotal(newTotal);
  }
  function checkIfSizesExist(item: Tables<"products">) {
    if (!item.size_large || !item.size_medium || !item.size_small) {
      setDefaultSize("XL");
    }
  }
  return (
    <Pressable style={styles.container}>
      <Stack.Screen options={{ headerTintColor: "#fff" }} />

      <CartImage fallback={products[0].image} path={cartItem.image as string} />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{cartItem.name}</Text>

        <View style={styles.subtitleContainer}>
          <Text style={styles.price}>
            {priceTag(price ? price : cartItem.price)}
          </Text>
          <Text className="text-xs">
            Size: {defaultSize ? defaultSize : cartItem.size}
          </Text>
        </View>
      </View>
      <View className="flex-col items-center">
        <View style={styles.quantitySelector}>
          <TouchableOpacity activeOpacity={0.7}>
            <FontAwesome
              onPress={() => dispatch(decreaseQuantity(cartItem))}
              name="minus"
              color="gray"
              style={{ padding: 5 }}
            />
          </TouchableOpacity>

          <Text style={styles.quantity}>{cartItem.quantity}</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <FontAwesome
              onPress={() => dispatch(increaseQuantity(cartItem))}
              name="plus"
              color="gray"
              style={{ padding: 5 }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="mt-4" activeOpacity={0.7}>
          <Link
            style={{ color: Colors.light.tint }}
            className="text-xs"
            href={`/user/menu/${cartItem.id}?update=${true}`}
          >
            Update Size
          </Link>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    paddingVertical: 20,
    columnGap: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 75,
    aspectRatio: 1,
    alignSelf: "center",
    marginRight: 10,
    borderRadius: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  quantitySelector: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  quantity: {
    fontWeight: "500",
    fontSize: 18,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});

export default CartListItem;
