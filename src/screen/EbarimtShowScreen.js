import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import QRCode from "react-native-qrcode-svg";
import axios from "axios";
import { serverUrl } from "../Consts";
import Spinning from "../components/Spinning";
import Feather from "@expo/vector-icons/Feather";
import * as Clipboard from "expo-clipboard";
const EbarimtShowScreen = (props) => {
  const order_id = props.route.params.order_id;
  const ebarimt_id = props.route.params.ebarimt_id;
  const utas = props.route.params.utas;
  const [loading, setloading] = useState(false);
  const [dataCheck, setdataCheck] = useState(null);
  const [Sms, setSms] = useState(null);

  const copyToClipboard = async (val) => {
    await Clipboard.setStringAsync(val.toString());
    Alert.alert(`"${val}" утга амжилттай хууллаа!`);
  };

  useEffect(() => {
    let clear = false;
    setloading(true);
    axios
      .post(serverUrl + "get_ebarimt.php", {
        order_id: order_id,
        ebarimt_id: ebarimt_id,
        utas: utas,
      })
      .then((res) => {
        if (clear === false) {
          let status = res.data.status ?? 0;
          let txt = res.data.txt ?? "Алдаа гарсан байна!";
          setSms(txt);
          if (status === 1) {
            setdataCheck(res.data.ebarimt);
          } else {
            setdataCheck(null);
          }
          setloading(false);
        }
      })
      .catch((err) => console.log(err));
    return () => {
      clear = true;
    };
  }, []);
  console.log(dataCheck);
  return (
    <View style={styles.container}>
      <ScrollView>
        {loading && <Spinning />}
        {dataCheck !== null ? (
          <View style={{ display: "flex", marginVertical: 15 }}>
            <TouchableOpacity style={styles.item}>
              <View style={{}}>
                <Text style={styles.sub}>Огноо: </Text>
                <Text style={styles.text}>{dataCheck.date}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() => copyToClipboard(dataCheck.id)}
            >
              <View style={{}}>
                <Text style={styles.sub}>ДДТД: </Text>
                <Text style={styles.text}>{dataCheck.id}</Text>
              </View>
              <View style={{}}>
                <Feather name="copy" size={24} color="black" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                copyToClipboard(dataCheck.lottery.replace(/\s+/, ""))
              }
            >
              <View style={{}}>
                <Text style={styles.sub}>Сугалааны дугаар: </Text>
                <Text style={styles.text}>{dataCheck.lottery}</Text>
              </View>
              <View style={{}}>
                <Feather name="copy" size={24} color="black" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => copyToClipboard(dataCheck.totalAmount)}
            >
              <View style={{}}>
                <Text style={styles.sub}>Бүртгүүлэх дүн: </Text>
                <Text style={styles.text}>{dataCheck.totalAmount}</Text>
              </View>
              <View style={{}}>
                <Feather name="copy" size={24} color="black" />
              </View>
            </TouchableOpacity>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <QRCode value={dataCheck.qrData} size={200} />
            </View>
          </View>
        ) : (
          <Text style={styles.text}>
            QR код: {props.route.params.order_id} {Sms}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default EbarimtShowScreen;

const styles = StyleSheet.create({
  item: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    marginVertical: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#e9e9e9ff",
    borderColor: "#2b2b2bff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  sub: {
    color: "#8a8a8aff",
  },
  text: {
    fontSize: 16,
    borderColor: "#2b2b2bff",
  },
});
