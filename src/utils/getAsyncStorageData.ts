import AsyncStorage from "@react-native-async-storage/async-storage";
export async function asyncStorageData() {
  const user = await AsyncStorage.getItem("@user");
  if (!user) return;
  const parseUser = JSON.parse(user);
  return parseUser;
}
