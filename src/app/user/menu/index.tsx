import {
  Image,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Alert,
  Text,
  Animated,
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
import { Stack, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import filter from "lodash/filter";
import { useEffect, useRef, useState } from "react";

import Animate, {
  BounceIn,
  FadeIn,
  ZoomInEasyDown,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { categorizeItems } from "@/src/lib/filterDataByCategory";
import HeaderImage from "@/src/components/HeaderImage";
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
  const { adminToUser } = useLocalSearchParams();

  const {
    data: categories,
    error: categoriesError,
    isLoading: isLoadingCategory,
  } = useGetCategories();
  const [currentSection, setCurrentSection] = useState("");
  const translateY = useRef(new Animated.Value(50)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const [scrollPosition, setScrollPosition] = useState(0);
  const [imageHeader, setImageHeader] = useState();

  useEffect(() => {
    if (productData?.length) {
      const categoryItems = categorizeItems(productData);
      if (categoryItems) {
        const f = formatDataForSectionList(categoryItems);
      }
    }
    setTimeout(() => {
      refreshData();
    }, 300);
    if (delivery?.length) {
      dateChanged();
    }
  }, [delivery, productData]);
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
  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      try {
        const section = viewableItems[0].item.data[0].categories.category;
        const categoryImage = viewableItems[0].item.data[0].categories.image;

        if (section !== currentSection) {
          setCurrentSection(section);
          setImageHeader(categoryImage);
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      } catch (error) {}
    }
  };
  const hideHeader = () => {
    Animated.spring(translateY, {
      toValue: -50,
      useNativeDriver: true,
    }).start();
  };
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 0, // Trigger when 50% of the item is visible
  };
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const layoutHeight = event.nativeEvent.layoutMeasurement.height;

        setScrollPosition(offsetY);
      },
    }
  ) as any;

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

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <View className=" bg-primary  w-full">
        {scrollPosition > 0 && (
          <Animated.View
            style={[styles.header, { transform: [{ translateY }] }]}
            className={"border-b-2 border-secondary-100"}
          >
            <View className="flex-row w-full items-center justify-between bg-transparent">
              <Text style={styles.headerText}>{currentSection}</Text>
              <HeaderImage
                fit="contain"
                path={imageHeader}
                fallback={products[0].image}
              />
            </View>
          </Animated.View>
        )}
        {sectionData && (
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
            onViewableItemsChanged={handleViewableItemsChanged}
            onScrollEndDrag={hideHeader}
            viewabilityConfig={viewabilityConfig}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ListHeaderComponent={() => (
              <Animate.View
                entering={BounceIn}
                className="rounded-xl bg-primary relative"
              >
                {scrollPosition === 0 && (
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
                        <Animate.Text
                          // entering={BounceIn}
                          className="text-3xl text-white font-bold"
                        >
                          PizzaPerk
                        </Animate.Text>
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => router.push("/location")}
                        >
                          <Animate.Image
                            entering={BounceIn}
                            source={icons.location}
                            resizeMode="contain"
                            className="w-6 h-6"
                          />
                        </TouchableOpacity>
                      </View>
                      <Animate.Text
                        // entering={ZoomInEasyDown.delay(50)}
                        className="text-white  opacity-100 line-height-8"
                      >
                        "Discover PizzaPerk: Your Crave-Worthy Shortcut to
                        Delicious Pizza Bliss!"
                      </Animate.Text>
                    </View>
                  </ImageBackground>
                )}
                {scrollPosition === 0 && (
                  <Image
                    source={icons.pizzaman}
                    resizeMode="contain"
                    className="w-12 h-12 absolute -top-7 rounded-full z-100"
                  />
                )}

                {scrollPosition === 0 && (
                  <Animate.View
                    className={"bg-transparent"}
                    entering={ZoomInEasyDown}
                  >
                    <HeaderProducts
                      filteredProducts={productData as any}
                      categories={categories as any}
                      filterDataByCategory={filterDataByCategory}
                      time={time}
                      finish={finish}
                      toggleFinish={toggleFinish}
                      adminToUser={adminToUser}
                    />
                  </Animate.View>
                )}
                {filterData.length > 0 && categories && (
                  <CategoryProducts
                    products={filterData}
                    categories={categories}
                  />
                )}
              </Animate.View>
            )}
            ItemSeparatorComponent={Separator}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
            }
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
        )}
      </View>
      <StatusBar
        backgroundColor={scrollPosition > 0 ? "#fff" : "transparent"}
        style="light"
      />
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
  header: {
    position: "absolute",
    top: 40,
    width: "100%",
    height: 100,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  headerText: {
    color: "#000",
    fontSize: 16,
  },
});
