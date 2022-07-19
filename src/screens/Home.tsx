import React, { useState } from "react";
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

import { Filter, Order, OrderProps, Button } from "../components";

import Logo from "../assets/logo_secondary.svg";

const Home = () => {
  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const items = [
    {
      id: "132",
      patrimony: "958774487",
      when: "18/07/2022 às 10:00h",
      status: "open",
    },
    {
      id: "133",
      patrimony: "958774487",
      when: "18/07/2022 às 10:00h",
      status: "closed",
    },
    {
      id: "134",
      patrimony: "958774487",
      when: "18/07/2022 às 10:00h",
      status: "closed",
    },
    {
      id: "135",
      patrimony: "958774487",
      when: "18/07/2022 às 10:00h",
      status: "open",
    },
    {
      id: "136",
      patrimony: "958774487",
      when: "18/07/2022 às 10:00h",
      status: "open",
    },
    {
      id: "137",
      patrimony: "958774487",
      when: "18/07/2022 às 10:00h",
      status: "open",
    },
  ];

  const { colors } = useTheme();

  const renderItem = ({ item }: { item: OrderProps }) => {
    return <Order data={item} />;
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
        <IconButton icon={<SignOut size={26} color={colors.gray[300]} />} />
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
          <Text color="gray.200">3</Text>
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

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderListEmpty}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <Button title="Nova solicitação" />
      </VStack>
    </VStack>
  );
};

export default Home;
