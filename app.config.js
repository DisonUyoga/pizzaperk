export default {
  expo: {
    name: "PizzaPerk",
    slug: "PizzaPerk",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/admin.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/admin.png",
      resizeMode: "contain",
      backgroundColor: "#161622",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.disonobudho.pizzaperk",
    },
    android: {
      package: "com.disonobudho.pizzaperk",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/admin.png",
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "53273a0a-7e37-45da-9d20-d0901fa5211b",
      },
    },
  },
};
