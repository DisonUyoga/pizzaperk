// import Toast from "react-native-root-toast";
import Toast from "react-native-toast-message";
export function toast(text: string, type: string) {
  Toast.show({
    type: type,
    text1: "Hi!!!🍕",
    text2: text,
    position: "top",
    topOffset: 60,
    swipeable: true,
  });
}
