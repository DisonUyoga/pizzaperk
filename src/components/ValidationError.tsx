import { View, Text } from "react-native";
import React, { ReactNode } from "react";

const ValidationError = ({ error }: { error: string }): ReactNode => {
  return <Text className="text-red-500 text-sm text-center">{error}</Text>;
};

export default ValidationError;
