import icons from "@/constants/icons";
import DeletingLoader from "@/src/components/DeletingLoader";
import FormElement from "@/src/components/FormElement";
import Loading from "@/src/components/Loading";
import OrderPlaceholderSkeleton from "@/src/components/OrderPlaceholderSkeleton";
import SelectDropDown from "@/src/components/SelectDropDown";
import Skeleton from "@/src/components/Skeleton";
import UpLoading from "@/src/components/Uploading";
import ValidationError from "@/src/components/ValidationError";
import { Tables } from "@/src/database.types";
import {
  useCreateProduct,
  useDelete,
  useUpdateProduct,
} from "@/src/lib/mutate";
import { useGetCategories, useGetProduct } from "@/src/lib/query";
import { uploadImage } from "@/src/lib/uploadImage";
// import { CreateType } from "@/src/type";
import { useAppSelector } from "@/src/utils/hooks";
import { toast } from "@/src/utils/toast";
import { validationSchema } from "@/src/utils/validation";
import * as ImagePicker from "expo-image-picker";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Item } from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

const Create = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string | null>(null);
  const [smallSize, setSmallSize] = useState<number | null>(null);
  const [mediumSize, setMediumSize] = useState<number | null>(null);
  const [largeSize, setLargeSize] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [discount, setDiscount] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<ImagePicker.ImagePickerAsset>();
  const { id } = useLocalSearchParams();
  const { globalErrors } = useAppSelector((state) => state.product);
  const [error, setError] = useState<any>([...globalErrors]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isUpdating = !!id;
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { mutate: updateProduct, isPending: updateIsPending } =
    useUpdateProduct();
  const { create } = useLocalSearchParams();
  const [whenCreatingLoader, setWhenCreatingLoader] = useState(create);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    string | null | undefined
  >(null);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const {
    data: categories,
    error: categoriesError,
    isLoading: isLoadingCategory,
  } = useGetCategories();
  const { mutate: deleteProduct } = useDelete();
  const {
    data: updatingProduct,
    isLoading,
    error: updateError,
  } = useGetProduct(id as string);

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price);
      setImage(updatingProduct.image);
      setDiscount(updatingProduct.discount);
      setSmallSize(updatingProduct.size_small);
      setMediumSize(updatingProduct.size_medium);
      setLargeSize(updatingProduct.size_large);
      setCategoryId(updatingProduct.category_id as number);
      const filteredCategory = categories?.find(
        (c: any) => c.id === updatingProduct.category_id
      );
      setSelectedCategory(filteredCategory?.category as string);
    }
  }, [updatingProduct]);
  useEffect(() => {
    if (!isLoadingCategory && categories) {
      toggleModal(categories[0].category);
    }
  }, [isLoadingCategory]);
  function toggleModal(category?: string | null, id?: number) {
    setModalVisible(!modalVisible);
    setSelectedCategory(category);
    setCategoryId(id);
  }
  if (isLoadingCategory) {
    return <OrderPlaceholderSkeleton />;
  }
  if (loading || updateIsPending) {
    return (
      <View className="bg-primary flex-1 items-center justify-center">
        <UpLoading />
      </View>
    );
  }
  if (deleteLoading) {
    return (
      <View className=" flex-1 items-center justify-center">
        <DeletingLoader />
      </View>
    );
  }
  if (isLoading && whenCreatingLoader === "true") {
    return <Loading />;
  }
  if (isLoading) {
    return <Skeleton />;
  }

  const openPicker = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
      });

      if (!res.canceled) {
        setImage(res.assets[0].uri);

        setFile(res.assets[0]);
      }
    } catch (error: any) {
      Alert.alert("Error", error);
    }
  };

  const confirmCategory = () => {
    setWhenCreatingLoader("");
    Alert.alert(
      "Confirm",
      `Your item is going to be saved under ${selectedCategory} category`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: isUpdating ? "Update" : "Create",
          style: "destructive",
          onPress: onSubmit,
        },
      ]
    );
  };
  const onSubmit = async () => {
    if (isUpdating) {
      return update();
    }
    return handleSubmit();
  };
  const handleSubmit = async () => {
    setLoading(true);
    setError([]);
    try {
      await validationSchema.validate({
        name,
        description,
        price: price,
        discount,
        image,
        categoryId,
      });
      const imagePath = (await uploadImage(file, image as string)) as
        | string
        | null;

      createProduct(
        {
          name,
          price: price as number,
          discount,
          description,
          image: imagePath,
          category_id: categoryId,
          size_small: smallSize,
          size_medium: mediumSize,
          size_large: largeSize,
        },
        {
          onSuccess: () => {
            resetFields();
            setLoading(false);
            router.push(`/admin/menu`);
          },
        }
      );
    } catch (error: any) {
      error.errors.map((err: string) =>
        setError((prev: string[]) => {
          return [...prev, err];
        })
      );
    } finally {
      setLoading(false);
    }
  };
  async function update() {
    setLoading(true);
    const imagePath = (await uploadImage(file, image as string)) as
      | string
      | null;

    try {
      if (!id) return;
      updateProduct(
        {
          id: parseFloat(id as string),
          name,
          description,
          discount,
          image: imagePath,
          price: price as number,
          category_id: categoryId,
          size_small: smallSize,
          size_medium: mediumSize,
          size_large: largeSize,
        },
        {
          onSuccess: () => {
            resetFields();
            setLoading(false);
            toast("product updated successfully", "success");
            router.back();
          },
        }
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

  const onDelete = () => {
    setDeleteLoading(true);
    if (!id) return;
    deleteProduct(id as string, {
      onSuccess: () => {
        resetFields();
        setDeleteLoading(false);
        toast("product deleted successfully", "success");
        router.replace("/admin/menu");
      },
    });
  };
  const Button = styled.Button`
    background-color: yellow;
    width: "100%";
    border-radius: 5px;
    padding: 10px;
    font-size: 0.9rem;
  `;
  function resetFields() {
    setName("");
    setPrice(null);
    setImage(null);
    setFile(undefined);
    setDescription(null);
    setDiscount(null);
    setSmallSize(null);
    setSmallSize(null);
    setLargeSize(null);
  }

  return (
    <SafeAreaView className="bg-primary flex-1 items-center justify-center px-4">
      <Stack.Screen
        options={{
          title: isUpdating ? "Update Product" : "Create Product",
          headerStyle: {
            backgroundColor: "#161622",
          },
          headerShown: true,
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#ffff",
            fontWeight: "300",
          },
        }}
      />
      {categories && (
        <View className="w-full">
          <Button
            title="set category"
            onPress={() => toggleModal()}
            color={"#0f6913"}
          />
        </View>
      )}
      {selectedCategory && (
        <Text className="text-gray-100 mt-2 font-bold text-md">
          Category: {selectedCategory}
        </Text>
      )}
      {categories && (
        <SelectDropDown
          items={categories}
          modalVisible={modalVisible}
          toggleModal={toggleModal}
        />
      )}
      <ScrollView>
        <View className="w-full items-center">
          <FormElement
            label="Name*"
            placeholder="name..."
            value={name}
            handleChange={(e) => setName(e)}
          />
          <FormElement
            label="Description"
            placeholder="description...(optional)"
            value={description}
            handleChange={(e) => setDescription(e)}
          />
          <FormElement
            label="XL price*"
            placeholder="extra large price..."
            value={isUpdating ? price?.toString() : price}
            handleChange={(e) => setPrice(e as unknown as number)}
            keyboardType="numeric"
          />
          <FormElement
            label="L price*"
            placeholder="large price..."
            value={isUpdating ? largeSize?.toString() : largeSize}
            handleChange={(e) => setLargeSize(e as unknown as number)}
            keyboardType="numeric"
          />
          <FormElement
            label="M price*"
            placeholder="medium price..."
            value={isUpdating ? mediumSize?.toString() : mediumSize}
            handleChange={(e) => setMediumSize(e as unknown as number)}
            keyboardType="numeric"
          />
          <FormElement
            label="S price*"
            placeholder="small price..."
            value={isUpdating ? smallSize?.toString() : smallSize}
            handleChange={(e) => setSmallSize(e as unknown as number)}
            keyboardType="numeric"
          />
          <FormElement
            label="Previous Price"
            placeholder="previous price...(optional)"
            value={isUpdating ? discount?.toString() : discount}
            handleChange={(e) => setDiscount(e as unknown as number)}
            keyboardType="numeric"
          />

          {image && (
            <View className="w-full items-center mt-4">
              <Image
                source={{ uri: image }}
                resizeMode="contain"
                className="w-full h-64"
              />
            </View>
          )}
          <TouchableOpacity
            onPress={() => openPicker()}
            className="w-full mt-4 rounded"
          >
            <View className="w-full h-40 px-4 bg-black-100 roudned-2xl justify-center items-center space-y-2">
              <Text className="text-white">Upload Product Image</Text>
              <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-1/2 h-1/2"
                />
              </View>
              {file?.fileName && (
                <Text className="text-white text-xs">{file.fileName}</Text>
              )}
            </View>
          </TouchableOpacity>
          <View className="w-full mt-4 mb-4">
            <Button
              title={isUpdating ? "Update" : "Create"}
              onPress={confirmCategory as any}
              color={"#FF8E01"}
            />
          </View>
          {isUpdating && (
            <Text
              className=" bg-red-500 mt-4 text-white p-2 w-full text-center rounded"
              onPress={handleDelete}
            >
              Delete
            </Text>
          )}
          <View className="mt-4">
            {error.length > 0 &&
              error.map((err: string, index: number) => (
                <ValidationError key={index} error={err} />
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  selected: {
    marginTop: 20,
    fontSize: 16,
    color: "blue",
  },
});
