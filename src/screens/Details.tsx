import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { HStack, VStack, useTheme, Text, ScrollView, Box } from "native-base";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import {
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  Clipboard,
} from "phosphor-react-native";

import {
  Header,
  OrderProps,
  Loading,
  CardDetails,
  Input,
  Button,
} from "../components";
import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";
import { dateFormat } from "../utils";

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};

const Details = () => {
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [loading, setLoading] = useState(true);
  const [loadingClose, setLoadingClose] = useState(false);
  const [solution, setSolution] = useState("");

  const { colors } = useTheme();
  const navigation = useNavigation();

  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((response) => {
        const {
          patrimony,
          description,
          status,
          created_at,
          closed_at,
          solution,
        } = response.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: response.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed,
        });

        setLoading(false);
      });
  }, []);

  const handleCloseOrder = () => {
    if (!solution) {
      return Alert.alert(
        "Solicitação",
        "Informe a solução para encerrar a solicitação."
      );
    }

    setLoadingClose(true);

    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setLoadingClose(false);
        Alert.alert("Solicitação", "Solicitação encerrada.");
        navigation.goBack();
      })
      .catch((error) => {
        setLoadingClose(false);
        console.log("error->", error);
        Alert.alert("Solicitação", "Não foi possível encerrar a solicitação.");
      });
  };

  if (loading) return <Loading />;

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}
        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "finalizado" : "em andamento"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="Equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
          footer={order.when}
        />
        <CardDetails
          title="Descrição do problema"
          description={order.description}
          icon={Clipboard}
        />
        <CardDetails
          title="Solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === "open" && (
            <Input
              placeholder="Descrição da solução"
              h={24}
              textAlignVertical="top"
              multiline
              onChangeText={setSolution}
            />
          )}
        </CardDetails>
      </ScrollView>
      {order.status === "open" && (
        <Button
          title="Encerrar solicitação"
          m={5}
          isLoading={loadingClose}
          onPress={handleCloseOrder}
        />
      )}
    </VStack>
  );
};

export default Details;
