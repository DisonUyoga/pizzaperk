import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
const FILE_SIZE = 10 * 1024 * 1024;
export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, "The name must contain atleast four characters")
    .defined("Name cannot be empty")
    .nullable("name cannot be empty")
    .required("Name is required"),
  description: Yup.string()
    .min(4, "The description must contain atleast four characters")
    .notRequired(),
  image: Yup.string().required("You must include product image"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price cannot be empty")
    .positive("Price must be a positive number")
    .min(1, "The price must be atleast one"),
  discount: Yup.number()
    .typeError("discount must be a number")
    .positive("discount must be a positive number")
    .min(1, "The discount must be atleast one")
    .notRequired(),
});

export const userValidation = Yup.object().shape({
  phone: Yup.string().nullable("Your phone number is required"),

  email: Yup.string().email("Invalid Email").required(),
  password: Yup.string()
    .required("password is required")
    .min(5, "password must contain atleast 5 characters")
    .matches(/[0-9]/, "Password must contain at least one number"),
});

export function imageValidation(file: ImagePicker.ImagePickerAsset) {
  const validate = Yup.object().shape({
    image: Yup.mixed().test({
      message: `File too big, can't exceed ${FILE_SIZE}`,
      test: (_) => {
        const isValid = file?.width * file?.height * 5 < FILE_SIZE;
        return isValid;
      },
    }),
  });
  return validate;
}

export const categoryValidation = Yup.object().shape({
  category: Yup.string().required("You must include category"),
  image: Yup.string().required("image is required"),
});
