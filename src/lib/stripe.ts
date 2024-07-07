import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { toast } from "../utils/toast";
import { Session, User } from "@supabase/supabase-js";

export const initializePaymentSheet = async (
  client_secret: string,
  user: string
) => {
  await initPaymentSheet({
    merchantDisplayName: "pizzaperk",
    paymentIntentClientSecret: client_secret,
    defaultBillingDetails: {
      name: user,
    },
  });
};
export const openPaymentSheet = async () => {
  const { error } = await presentPaymentSheet();
  if (error) {
    return false;
  }
  return true;
};
