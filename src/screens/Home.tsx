import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  VStack,
  HStack,
  IconButton,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center,
} from "native-base";
import { SignOut, ChatTeardropText } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { Filter, Order, OrderProps, Button, Loading } from "../components";
import { dateFormat } from "../utils";

import Logo from "../assets/logo_secondary.svg";

const Home = () => {
  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [loading, setLoading] = useState(true);

  const { colors } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);

    const subscriber = firestore()
      .collection("orders")
      .where("status", "==", statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((item) => {
          const { patrimony, description, status, created_at } = item.data();
          return {
            id: item.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at),
          };
        });
        setOrders(data);
        setLoading(false);

        return subscriber;
      });
  }, [statusSelected]);

  const renderItem = ({ item }: { item: OrderProps }) => {
    return <Order data={item} onPress={() => handleOpenDetails(item.id)} />;
  };

  const renderListEmpty = () => (
    <Center>
      <ChatTeardropText color={colors.gray[300]} size={40} />
      <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
        Você ainda não possui {"\n"} solicitações{" "}
        {statusSelected === "open" ? "em andamento" : "finalizadas"}
      </Text>
    </Center>
  );

  const handleNewOrder = () => navigation.navigate("Register");

  const handleOpenDetails = (orderId: string) =>
    navigation.navigate("Details", { orderId });

  const handleLogout = () => {
    auth()
      .signOut()
      .catch((error) => {
        console.log("error logout->", error);
        return Alert.alert("Sair", "Não foi possível sair.");
      });
  };

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Meus Chamados</Heading>
          <Text color="gray.200">{orders.length}</Text>
        </HStack>
        <HStack space={3} mb={8}>
          <Filter
            type="open"
            title="Em andamento"
            onPress={() => setStatusSelected("open")}
            isActive={statusSelected === "open"}
          />
          <Filter
            type="closed"
            title="Finalizados"
            onPress={() => setStatusSelected("closed")}
            isActive={statusSelected === "closed"}
          />
        </HStack>

        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderListEmpty}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
};

export default Home;
