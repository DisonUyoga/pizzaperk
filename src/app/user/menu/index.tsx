import {
  Image,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  SectionList,
} from "react-native";

import products from "@/assets/data/products";
import ProductCard from "@/components/ProductCard";
import icons from "@/constants/icons";
import CategoryProducts from "@/src/components/CategoryProducts";
import HeaderProducts from "@/src/components/HeaderProducts";
import SearchComponent from "@/src/components/SearchComponent";
import Skeleton from "@/src/components/Skeleton";
import { View } from "@/src/components/Themed";
import {
  useGetCategories,
  useGetDelivery,
  useGetProducts,
} from "@/src/lib/query";
import { getTimeDifferenceInSeconds } from "@/src/lib/timer";
import { useRefresh } from "@/src/lib/useRefresh";
import { Tables } from "@/src/type";
import { useAppSelector } from "@/src/utils/hooks";
import { toast } from "@/src/utils/toast";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import filter from "lodash/filter";
import { useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import Animated, {
  BounceIn,
  FadeIn,
  ZoomInEasyDown,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { categorizeItems } from "@/src/lib/filterDataByCategory";
const product = products[0];
const productOnOffer = products.slice(0, 5);

export default function TabOneScreen() {
  const [filterData, setFilterData] = useState<Tables<"products">[]>([]);
  const refresh = useRefresh();
  const { data: productData, error, isLoading } = useGetProducts();
  const [time, setTime] = useState(0);
  const [finish, setFinish] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sectionData, setSectionData] = useState<any>();
  const { session } = useAppSelector((state) => state.auth);
  const { categoryModalVisible } = useAppSelector((state) => state.product);
  const {
    data: delivery,
    isLoading: isLoadingDelivery,
    error: errorDelivery,
  } = useGetDelivery();

  const {
    data: categories,
    error: categoriesError,
    isLoading: isLoadingCategory,
  } = useGetCategories();

  useEffect(() => {
    if (productData?.length) {
      const categoryItems = categorizeItems(productData);
      if (categoryItems) {
        const f = formatDataForSectionList(categoryItems);
        // setSectionData(f);
      }
    }
    if (delivery?.length) {
      dateChanged();
    }
  }, [delivery, productData]);

  if (isLoading && isLoadingCategory && isLoadingDelivery) {
    return <Skeleton />;
  }
  if (error) {
    return Alert.alert("Fetch Error", error.message);
  }
  function filterDataByCategory(p: Tables<"products">[], id: number) {
    if (!categories) return;
    const cat = categories.find((c: Tables<"categories">) => c.id === id);
    const categoryData: Tables<"products">[] = filter(p, (data) => {
      return constant(data, cat?.id);
    });
    if (categoryData?.length === 0) {
      setFilterData([]);
      toast("Item not in the menu at the moment", "error");
      return;
    }
    setFilterData(categoryData);
  }

  function dateChanged() {
    if (!delivery) return;
    if (delivery[0]?.countdown) {
      const differenceInSeconds = getTimeDifferenceInSeconds(delivery);
      setTime(differenceInSeconds);
      setFinish(true);
    }
  }

  function constant(p: Tables<"products">, id: number | undefined) {
    if (p.category_id === id) return true;
    return false;
  }

  function toggleFinish() {
    setFinish(false);
  }

  function refreshData() {
    setRefreshing(true);
    refresh("products");
    refresh("categories");
    refresh("delivery");
    setRefreshing(false);
  }

  const formatDataForSectionList = (categorizedItems: any) => {
    const f = Object.keys(categorizedItems).map((key) => {
      return {
        categoryId: key,
        data: categorizedItems[key],
      };
    });
    setSectionData(f);
    return f;
  };

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <View className=" bg-primary  w-full">
        {sectionData ? (
          <SectionList
            sections={sectionData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="px-2 bg-transparent">
                <ProductCard
                  product={item}
                  otherStyles="w-full"
                  containerStyle={`border border-secondary items-center justify-center px-2 flex-1`}
                />
              </View>
            )}
            ListHeaderComponent={() => (
              <Animated.View
                entering={FadeIn}
                className="rounded-xl bg-primary relative"
              >
                <ImageBackground
                  source={icons.pizzaperk}
                  resizeMode="cover"
                  className="w-full h-48"
                  imageStyle={styles.imageStyle}
                >
                  <View className="bg-transparent absolute left-4 w-full py-4 space-y-4">
                    <View className="bg-transparent">
                      <SearchComponent products={productData as any} />
                    </View>
                    <View className="bg-transparent flex-row items-center w-full gap-x-[80px]">
                      <Animated.Text
                        entering={BounceIn}
                        className="text-3xl text-white font-bold"
                      >
                        PizzaPerk
                      </Animated.Text>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => router.push("/location")}
                      >
                        <Animated.Image
                          entering={BounceIn}
                          source={icons.location}
                          resizeMode="contain"
                          className="w-6 h-6"
                        />
                      </TouchableOpacity>
                    </View>
                    <Animated.Text
                      entering={ZoomInEasyDown.delay(50)}
                      className="text-white  opacity-100 line-height-8"
                    >
                      "Discover PizzaPerk: Your Crave-Worthy Shortcut to
                      Delicious Pizza Bliss!"
                    </Animated.Text>
                  </View>
                </ImageBackground>
                <Image
                  source={icons.pizzaman}
                  resizeMode="contain"
                  className="w-12 h-12 absolute -top-7 rounded-full z-100"
                />

                <HeaderProducts
                  filteredProducts={productData as any}
                  categories={categories as any}
                  filterDataByCategory={filterDataByCategory}
                  time={time}
                  finish={finish}
                  toggleFinish={toggleFinish}
                />
                {filterData.length > 0 && categories && (
                  <CategoryProducts
                    products={filterData}
                    categories={categories}
                  />
                )}
              </Animated.View>
            )}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={{
              gap: 5,

              zIndex: 10,

              paddingTop: 30,
              borderRadius: 20,
            }}
            renderSectionHeader={({ section: { categoryId } }) => {
              const cat = categories?.find(
                (c) => c.id === parseInt(categoryId)
              );
             
              return (
                <View className="bg-transparent px-4">
                  <Text className="text-white  font-thin">{cat?.category}</Text>
                </View>
              );
            }}
          />
        ) : (
          <View className="w-full">
            <Skeleton />
          </View>
        )}
      </View>
      <StatusBar backgroundColor="transparent" style="light" />
    </SafeAreaView>
  );
}

const Separator = () => {
  return <View className="border border-secondary-100"></View>;
};
const styles = StyleSheet.create({
  imageStyle: {
    resizeMode: "cover",
    borderBottomLeftRadius: 20,
    opacity: 0.4,
    borderTopRightRadius: 20,
    backgroundColor: "#161622",
  },
});
