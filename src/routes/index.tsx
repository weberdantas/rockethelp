import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import Signin from "../screens/Signin";
import AppRoutes from "./app.routes";
import { Loading } from "../components";

const Routes = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((response) => {
      setUser(response);
      setLoading(false);
    });

    return subscriber;
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {user ? <AppRoutes /> : <Signin />}
    </NavigationContainer>
  );
};

export default Routes;
