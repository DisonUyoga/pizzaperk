import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import ProductDetailImage from "./ProductDetailImage";
import { Tables } from "../database.types";
import ZoomImage from "./EnlargeImage";

interface ZoomProps {
  openZoom: boolean;
  toggleZoom: () => void;
  product: Tables<"products">;
}
const ZoomImageDetailModal = ({ openZoom, toggleZoom, product }: ZoomProps) => {
  const pan = useRef(new Animated.ValueXY()).current as any;
  const initialSize = 100;
  const [size, setSize] = useState(initialSize);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        });
        const newSize = initialSize + gestureState.dy;
        setSize(newSize > 50 ? newSize : 50);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;
  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={openZoom}
      className="relative"
    >
      <TouchableOpacity onPress={toggleZoom} className="absolute top-2 left-4">
        <FontAwesome name="arrow-left" size={28} />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text className="text-center">
          Hold image, drag vertically downwards to enlarge
        </Text>
        <Animated.View
          {...panResponder.panHandlers}
          style={[pan.getLayout(), styles.box, { width: size, height: size }]}
        >
          <ZoomImage fallback="" path={product?.image as string} />
        </Animated.View>
      </View>
    </Modal>
  );
};
export default ZoomImageDetailModal;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    padding: 20,
    backgroundColor: "#161622",
    borderRadius: 5,
  },
});
