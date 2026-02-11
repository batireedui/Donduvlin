import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import axios from "axios";
import { checkConnected } from "../function";
import NoConnectionScreen from "./NoConnectionScreen";

import { serverUrl } from "../Consts";
import Spinning from "../components/Spinning";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
const CheckScreen = ({ navigation }) => {
  const [connectStatus, setConnectStatus] = useState(false);
  const [checkers, setCheckers] = useState([]);
  const [loading, setloading] = useState(false);
  const [dataCheck, setdataCheck] = useState(true);
  const [utas, setUtas] = useState(null);
  const [phone, setphone] = useState(null);
  const [Sms, setSms] = useState(null);

  checkConnected().then((res) => {
    setConnectStatus(res);
  });
  useEffect(() => {
    getData();
    return () => {};
  }, []);
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@phoneVal");
      if (value !== null) {
        setUtas(value);
        setphone(value);
      }
    } catch (e) {}
  };
  useEffect(() => {

    let clear = false;
    setloading(true);
    axios
      .post(serverUrl + "checkapi.php", { utas: phone })
      .then((data) => {
        if (clear === false) {
          if (data.data.indexOf("nodata") > -1) {
            setdataCheck(false);
            setSms("Захиалга олдсонгүй");
          } else if (data.data.indexOf("nophone") > -1) {
            setdataCheck(false);
            setSms("Утасны дугаараа оруулна уу");
          } else {
            setCheckers(data.data);
            setdataCheck(true);
          }
          setloading(false);
        }
      })
      .catch((err) => console.log(err));
    return () => {
      clear = true;
    };
  }, [phone]);
  const endEdit = () => {
    setphone(utas);
  };
  const getstyle = (eseh) => {
    if (eseh === "УНШИГДСАН")
      return { borderBottomColor: "green", color: "green" };
    else if (eseh === "БАТАЛГААЖСАН")
      return { borderBottomColor: "#31709C", color: "#31709C" };
    else if (eseh === "ГЭСГҮЙ ЛАМД ШИЛЖСЭН")
      return { borderBottomColor: "#F8BB05", color: "#F8BB05" };
    else if (eseh === "ТӨЛБӨР ДУТУУ")
      return { borderBottomColor: "#F8BB05", color: "#F8BB05" };
    else return { borderBottomColor: "red", color: "red" };
  };

  return connectStatus ? (
    <View style={{flex:1}}>
      <View style={styles.head}>
        <TextInput
          placeholder="Утасны дугаараа оруулна уу"
          keyboardType="numeric"
          value={utas}
          style={styles.Inputp}
          onChangeText={setUtas}
          onEndEditing={endEdit}
        />
      </View>
      <ScrollView>
        {loading && <Spinning />}
        {dataCheck ? (
          checkers.map((el) => (
            <View key={el[0].id} style={styles.view}>
              <Text style={[styles.htext, getstyle(el[3])]}>{el[3]}</Text>
              <View></View>
              <Text>
                Гүйлгээний утга:{" "}
                <Text style={{ fontWeight: "bold" }}> {el[0].id}</Text>
              </Text>
              <Text>
                Хэнээс:{" "}
                <Text style={{ fontWeight: "bold" }}> {el[0].hens}</Text>
              </Text>
              <Text>
                Хэнд/Ам бүл:{" "}
                <Text style={{ fontWeight: "bold" }}>{el[0].hend}</Text>
              </Text>
              <Text>
                Огноо: <Text style={{ fontWeight: "bold" }}>{el[0].hezee}</Text>
              </Text>
              <Text>
                Сүсэглэсэн дүн:{" "}
                <Text style={{ fontWeight: "bold" }}>{el[0].niitdun}₮</Text>
              </Text>
              <Text style={{ fontWeight: "bold" }}>Бичүүлсэн ном, айлтгал</Text>
              <View style={{ marginLeft: 10 }}>
                {el[1].map((e) => (
                  <Text key={e.NER}> - {e.NER}</Text>
                ))}
              </View>
              {el[4] > 0 ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EbarimtShowScreen", {
                      order_id: el[0].id,
                      ebarimt_id: el[4],
                      utas: utas
                    })
                  }
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/ebarimt.png")}
                    style={{
                      width: 35,
                      height: 25,
                      marginHorizontal: 5,
                      resizeMode: "contain",
                    }}
                  />
                  <Text style={{ fontWeight: "bold" }}>ebarimt харах</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", padding: 15 }}>{Sms}</Text>
        )}
      </ScrollView>
    </View>
  ) : (
    <NoConnectionScreen onCheck={checkConnected} />
  );
};
export default CheckScreen;
const styles = StyleSheet.create({
  head: {
    backgroundColor: "#ca4e18",
  },
  htext: {
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 10,
    borderBottomWidth: 2,
    marginBottom: 10,
  },
  view: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 9,
    padding: 15,
    borderRadius: 10,
  },
  Inputp: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: "#ff7700",
    borderWidth: 1,
    borderRadius: 20,
    margin: 20,
    backgroundColor: "#f0f9ff",
  },
});
