import { Link, Redirect, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import {
  processingAuth,
  sessionToken,
  setAdmin,
  setProfileData,
  setUser,
} from "../app/features/slices/AuthSlice";
import { supabase } from "../lib/supabase";
import { ResetFormType, UserType } from "../type";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { toast } from "../utils/toast";
import { userValidation } from "../utils/validation";
import FormElement from "./FormElement";
import GoogleLogin from "./GoogleLogin";
import ValidationError from "./ValidationError";

export interface SignInWithGoogleProps {
  title: string;

  type?: string;
}
interface StripeSignupProps {
  username: string;
  password: string;
  email?: string;
}

const SigninWithGoogleOrMail = ({ title, type }: SignInWithGoogleProps) => {
  const [form, setForm] = useState<UserType>({
    phone: "",
    password: "",
    email: "",
  });

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authLoading } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string[] | undefined>([]);

  async function signupWithEmail(
    email: string,
    password: string,
    phone: string
  ) {
    dispatch(processingAuth({ authLoading: true }));
    // sign up logic
    if (type === "signup") {
      const { error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
        phone,
      });

      if (!supabaseError?.message) {
        toast("sign up successfull", "success");
        return router.push("/sign-in");
      }
      setError([supabaseError?.message as string]);
      dispatch(processingAuth({ authLoading: false }));

      return;
    }
    // sign in logic
    const { error: supabaseError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setError([supabaseError?.message as string]);
    if (!supabaseError?.message) {
      toast("login successfull", "success");
      const { data, error } = await supabase.auth.getSession();
      dispatch(
        sessionToken({
          session: {
            email: data.session?.user.email,
            name: data.session?.user.email,
          },
        })
      );
      dispatch(setUser({ user: data.session }));
      // query profile data to determine the role i.e user or admin session
      if (data.session) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        dispatch(setProfileData({ profile: profileData }));
        dispatch(
          setAdmin({ isAdmin: profileData?.group === "ADMIN" ? true : false })
        );
        dispatch(processingAuth({ authLoading: false }));
      }
      return <Redirect href={"/user/menu"} />;
    }
  }

  return (
    <View className="w-full space-y-6 items-center">
      <Formik
        initialValues={form}
        onSubmit={async (value: UserType, { resetForm }: ResetFormType) => {
          setError([]);
          try {
            await userValidation.validate(value);

            await signupWithEmail(
              value.email as string,
              value.password,
              value.phone as string
            );

            resetForm({ values: { phone: "", password: "", email: "" } });
          } catch (error: any) {
            error.errors.map((err: any) =>
              setError((prev: any) => {
                return [...prev, err];
              })
            );
          } finally {
            dispatch(processingAuth({ authLoading: false }));
          }
        }}
      >
        {({ handleChange, handleBlur, values, handleSubmit }) => (
          <View className="item-center w-full">
            {type == "signup" && (
              <FormElement
                label="Phone"
                placeholder="phone"
                value={values.phone}
                handleChange={handleChange("phone")}
                onBlur={handleBlur("phone")}
              />
            )}

            <FormElement
              label="Email"
              placeholder="email"
              value={values.email}
              onBlur={handleBlur("email")}
              handleChange={handleChange("email")}
            />

            <FormElement
              label="Password"
              placeholder="password"
              onBlur={handleBlur("password")}
              value={values.password}
              handleChange={handleChange("password")}
            />
            <View className="mt-7">
              {authLoading ? (
                <ActivityIndicator size={"small"} color="#ffff" />
              ) : (
                <Button
                  title="Submit"
                  onPress={handleSubmit as any}
                  color="#FF8E01"
                  disabled={authLoading}
                />
              )}
            </View>
          </View>
        )}
      </Formik>

      <View className="w-full">
        <GoogleLogin />
      </View>

      {error?.length &&
        error.map((err, index) => <ValidationError key={index} error={err} />)}
      {type === "signup" ? (
        <View className="items-center mt-4">
          <Text className="text-white">
            Have an account?{" "}
            <Link className="text-secondary" href="/sign-in">
              Sign in
            </Link>
          </Text>
        </View>
      ) : (
        <View className="items-center mt-4">
          <Text className="text-gray-100">
            Don't have an account?{" "}
            <Link className="text-secondary" href="/sign-up">
              Sign up
            </Link>
          </Text>
        </View>
      )}
    </View>
  );
};

export default SigninWithGoogleOrMail;
