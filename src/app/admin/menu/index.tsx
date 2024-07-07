import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import products from "@/assets/data/products";
import ProductCard from "@/components/ProductCard";
import icons from "@/constants/icons";
import SearchComponent from "@/src/components/SearchComponent";
import Skeleton from "@/src/components/Skeleton";
import { Text, View } from "@/src/components/Themed";
import {
  useGetCategories,
  useGetDelivery,
  useGetProducts,
} from "@/src/lib/query";
import { Link, Stack } from "expo-router";
import { Alert } from "react-native";
import Animated, {
  BounceIn,
  FadeIn,
  ZoomInEasyDown,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import FreeDelivery from "@/src/components/FreeDelivery";
import { useEffect, useState } from "react";
import { useRefresh } from "@/src/lib/useRefresh";
import CreateCategory from "@/src/components/CreateCategory";
import HeaderProducts from "@/src/components/HeaderProducts";
import { Tables } from "@/src/database.types";
import { filter } from "lodash";
import { toast } from "@/src/utils/toast";
import { getTimeDifferenceInSeconds } from "@/src/lib/timer";
import CategoryDetail from "@/src/components/CategoryDetail";
const product = products[0];
const productOnOffer = products.slice(0, 5);

export default function TabOneScreen() {
  const { data: productData, error, isLoading } = useGetProducts();
  const [filterData, setFilterData] = useState<Tables<"products">[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [time, setTime] = useState(0);
  const [finish, setFinish] = useState(false);
  const refresh = useRefresh();
  const {
    data: delivery,
    isLoading: isLoadingDelivery,
    error: errorDelivery,
  } = useGetDelivery();

  const [visible, setVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryItemId, setCategoryItemId] = useState<number | undefined>();
  const {
    data: categories,
    error: categoriesError,
    isLoading: isLoadingCategory,
  } = useGetCategories();
  useEffect(() => {
    if (!isLoading) {
      setFilterData(productData as any);
    }
    if (delivery?.length) {
      dateChanged();
    }
  }, [isLoading, delivery]);

  if (isLoading || isLoadingCategory) {
    return <Skeleton />;
  }
  if (error) {
    return Alert.alert("Fetch Error", error.message);
  }
  function toggleModal() {
    setVisible(!visible);
  }
  function toggleCreateVisible() {
    setCreateVisible(!createVisible);
  }
  function refreshData() {
    setRefreshing(true);
    refresh("products");
    refresh("categories");
    refresh("delivery");
    setRefreshing(false);
  }
  function filterDataByCategory(p: Tables<"products">[], id: number) {
    if (!categories) return;
    const cat = categories.find((c) => c.id === id);
    const categoryData: Tables<"products">[] = filter(p, (data) => {
      return constant(data, cat?.id);
    });
    if (categoryData?.length === 0) {
      setFilterData(productData as any);
      toast("Item not in the menu at the moment", "error");
      return;
    }
    setFilterData(categoryData);
  }
  function constant(p: Tables<"products">, id: number | undefined) {
    if (p.category_id === id) return true;
    return false;
  }
  function dateChanged() {
    if (!delivery) return;
    if (delivery[0]?.countdown) {
      const differenceInSeconds = getTimeDifferenceInSeconds(delivery);
      setTime(differenceInSeconds);
      setFinish(true);
    }
  }
  function toggleFinish() {
    setFinish(false);
  }
  function toggleCategory() {
    setOpenCategory(!openCategory);
  }
  function setCategoryId(id: number) {
    setCategoryItemId(id);
  }
  return (
    <SafeAreaView className="bg-primary flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <Pressable className=" bg-primary  w-full">
        <FlatList
          data={filterData?.length > 0 ? filterData : productData}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
          }
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
                source={icons.admin}
                resizeMode="contain"
                className="w-full h-48"
                imageStyle={styles.imageStyle}
              >
                <View className="bg-transparent absolute left-4 w-full py-4 space-y-2">
                  <View className="bg-transparent">
                    <SearchComponent products={productData as any} />
                  </View>

                  <Animated.Text
                    entering={BounceIn}
                    className="text-3xl text-white font-bold"
                  >
                    PizzaPerk Admin
                  </Animated.Text>

                  <Animated.Text
                    entering={ZoomInEasyDown.delay(50)}
                    className="text-white  opacity-100 line-height-8"
                  >
                    Your Ultimate App Management Solution
                  </Animated.Text>
                </View>
              </ImageBackground>
              <View className="flex-row mt-2 items-center justify-between px-2 bg-transparent relative">
                <Link href={"/admin/menu/create"} asChild>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    className=" justify-center items-center"
                  >
                    <Image
                      source={icons.addItem}
                      resizeMode="contain"
                      className="w-10 h-10"
                    />
                    <Text className="text-gray-100 text-xs px-3">
                      Add Items
                    </Text>
                  </TouchableOpacity>
                </Link>
                <TouchableOpacity
                  activeOpacity={0.6}
                  className=" justify-center items-center"
                  onPress={() => toggleCreateVisible()}
                >
                  <Image
                    source={icons.menu}
                    resizeMode="contain"
                    className="w-10 h-10"
                  />
                  <Text
                    className="text-gray-100 text-xs px-3"
                    numberOfLines={2}
                  >
                    create category
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  className=" justify-center items-center"
                  onPress={() => toggleModal()}
                >
                  <Image
                    source={icons.delivery}
                    resizeMode="contain"
                    className="w-10 h-10"
                  />
                  <Text
                    className="text-gray-100 text-xs px-3"
                    numberOfLines={2}
                  >
                    Free Delivery
                  </Text>
                </TouchableOpacity>
              </View>
              <HeaderProducts
                filteredProducts={productData as any}
                categories={categories as any}
                filterDataByCategory={filterDataByCategory}
                time={time}
                finish={finish}
                toggleFinish={toggleFinish}
                toggleCategory={toggleCategory}
                setCategoryId={setCategoryId}
              />
              {categories && (
                <CategoryDetail
                  toggleCategory={toggleCategory}
                  openCategory={openCategory}
                  category={categories}
                  categoryItemId={categoryItemId as number}
                />
              )}
              <CreateCategory
                createVisible={createVisible}
                toggleCreateVisible={toggleCreateVisible}
              />
              <FreeDelivery visible={visible} toggleModal={toggleModal} />
            </Animated.View>
          )}
          contentContainerStyle={{
            gap: 10,
            paddingBottom: 10,

            paddingTop: 30,
            borderRadius: 20,
          }}
          ItemSeparatorComponent={Separator}
        />
      </Pressable>
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
