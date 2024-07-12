import { Image as Img } from "expo-image";
import { StyleSheet, Dimensions, Image, View } from "react-native";
import React, { ComponentProps, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { blurhash } from "@/assets/data/products";
import { useSupabaseImageDownLoad } from "../utils/useSupabaseImageDownLoad";
import { ImageBackground } from "react-native";

type RemoteImageProps = {
  path?: string;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, "source">;
const windowWidth = Dimensions.get("window").width;

const ProductDetailImage = ({
  path,
  fallback,
  ...imageProps
}: RemoteImageProps) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const image = useSupabaseImageDownLoad(path);
  useEffect(() => {
    Image.getSize(
      image || fallback,
      (width, height) => {
        // Determine the size to make the image square
        const size = Math.min(width, height, windowWidth);
        setImageSize({ width: size, height: size });
      },
      (error) => {
        console.error("Failed to get image size:", error);
      }
    );
  }, [image]);

  if (!image) {
  }

  return (
    <View style={styles.container}>
      <Img
        source={image}
        style={[styles.image, imageSize]}
        placeholder={{ blurhash }}
        contentFit="cover"
      />
    </View>
  );
};

export default ProductDetailImage;
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  image: {
    width: windowWidth,
    height: windowWidth,
    borderRadius: 10,
  },
});
