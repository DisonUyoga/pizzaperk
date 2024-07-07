import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "@/components/constants/Colors";
import { forwardRef } from "react";
import { useAppSelector } from "../utils/hooks";

type ButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<typeof TouchableOpacity>;

const Button = forwardRef<View | null, ButtonProps | any>(
  ({ text, otherStyles, handlePress, ...pressableProps }, ref) => {
    return (
      <View className="w-full items-center justify-center">
        <TouchableOpacity
          activeOpacity={0.7}
          ref={ref}
          onPress={() => handlePress()}
          {...pressableProps}
          // style={styles.container}
          className={`${otherStyles}`}
        >
          <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF9C01",
    // width: "100%",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default Button;
