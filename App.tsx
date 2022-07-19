import React from "react";
import { NativeBaseProvider, StatusBar } from "native-base";
import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
} from "@expo-google-fonts/roboto";

import Signin from "./src/screens/Signin";
import Home from "./src/screens/Home";

import { THEME } from "./src/styles/theme";
import { Loading } from "./src/components";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fontsLoaded ? <Home /> : <Loading />}
    </NativeBaseProvider>
  );
}
