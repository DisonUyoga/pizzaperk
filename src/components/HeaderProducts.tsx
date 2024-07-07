import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import _ from "lodash";
import Countdown from "react-native-countdown-fixed";
import { Tables } from "../database.types";
import { colors } from "../global/styles";
import products from "@/assets/data/products";
import HeaderImage from "./HeaderImage";
import { useAppSelector } from "../utils/hooks";
interface ProductsOnOfferProps {
  categories: Tables<"categories">[];
  filterDataByCategory: (p: Tables<"products">[], id: number) => void;
  filteredProducts: Tables<"products">[];
  finish: boolean;
  time: number;
  toggleFinish: () => void;
  toggleCategory?: () => void;
  setCategoryId?: (id: number) => void;
  toggleCategoryModal?: () => void;
}

const ProductsOnOffer = ({
  categories,
  filteredProducts,
  filterDataByCategory,
  finish,
  time,
  toggleFinish,
  toggleCategory,
  setCategoryId,
  toggleCategoryModal,
}: ProductsOnOfferProps) => {
  const [animateItemItem, setAnimateItem] = useState<any>();
  const [indexCheck, setIndexCheck] = useState(0);
  const { isAdmin } = useAppSelector((state) => state.auth);

  return (
    <View className="px-2 space-y-2">
      {finish && time && (
        <View className="items-center  justify-center gap-2 mt-1">
          <Text className="text-gray-100 text-center mt-2 text-xs font-bold">
            Free Delivery Now
          </Text>

          <Countdown
            until={time} // 5 minutes in seconds
            size={10}
            onFinish={() => toggleFinish()}
            digitStyle={{ backgroundColor: "#FFF" }}
            digitTxtStyle={{ color: "#1CC625" }}
            timeLabelStyle={{ color: "red", fontWeight: "bold" }}
            separatorStyle={{ color: "#1CC625" }}
            timeToShow={["H", "M", "S"]}
            timeLabels={{ h: "HH", m: "MM", s: "SS" }}
          />
        </View>
      )}

      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item: any) => item.id}
        extraData={indexCheck}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              setIndexCheck(item.id);

              if (isAdmin && toggleCategory && setCategoryId) {
                toggleCategory();
                setCategoryId(item.id);
              }
              if (!isAdmin && toggleCategoryModal) {
                toggleCategoryModal();
                filterDataByCategory(filteredProducts, item.id);
              }
            }}
          >
            <View
              style={
                indexCheck === item.id
                  ? { ...styles.smallCardSelected }
                  : { ...styles.smallCard }
              }
            >
              {/* <Image
                style={{ height: 60, width: 60, borderRadius: 30 }}
                source={{ uri: item.image as any }}
              /> */}
              <HeaderImage
                fallback={products[0].image}
                path={item.image as string}
              />

              <View>
                <Text
                  style={
                    indexCheck === item.id
                      ? { ...styles.smallCardTextSected }
                      : { ...styles.smallCardText }
                  }
                >
                  {_.truncate(item.category as string, {
                    separator: " ",
                    length: 10,
                  })}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default ProductsOnOffer;

const styles = StyleSheet.create({
  smallCard: {
    borderRadius: 30,
    backgroundColor: colors.grey5,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    width: 80,
    margin: 10,
    height: 100,
  },

  smallCardSelected: {
    borderRadius: 30,
    backgroundColor: colors.buttons,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    width: 80,
    margin: 10,
    height: 100,
  },

  smallCardTextSected: {
    fontWeight: "bold",
    color: colors.cardbackground,
  },

  smallCardText: {
    fontWeight: "bold",
    color: colors.grey2,
  },
});
