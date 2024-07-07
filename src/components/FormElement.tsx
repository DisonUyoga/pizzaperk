import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import icons from "@/constants/icons";

interface FormElementProps extends TextInputProps {
  handleChange: (e: string) => void;
  label: string;
  value: any;
  placeholder: string;
  keybordType?: string;
}

const CreateTextInput = ({
  handleChange,
  label,
  placeholder,
  value,
  keyboardType,
}: FormElementProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className="w-full space-y-1 mt-3 items-center justify-between flex-row">
      <View className="w-full">
        <Text className="text-white font-bold text-lg">{label}</Text>
        <View className="w-full items-center px-8 py-2 border border-secondary rounded flex-row  justify-between">
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={"#686363"}
            onChangeText={handleChange}
            value={value}
            keyboardType={keyboardType}
            className="text-white w-full"
            secureTextEntry={label === "Password" && !showPassword}
          />
          {label === "Password" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={!showPassword ? icons.eye : icons.eyeHide}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CreateTextInput;
