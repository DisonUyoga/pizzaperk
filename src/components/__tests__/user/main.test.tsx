import * as React from "react";
import renderer from "react-test-renderer";
import { Text } from "react-native";
import ProductCard from "../../ProductCard";

it(`renders correctly`, () => {
  const data = {
    created_at: "2024-05-05",
    description: "testing",
    discount: 250,
    id: 24,
    image: "http://example.com",
    name: "testing",
    percentage_discount: 250,
    price: 250,
  };
});
