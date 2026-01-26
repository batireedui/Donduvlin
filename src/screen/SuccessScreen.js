import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  useWindowDimensions,
  Linking,
} from "react-native";
import axios from "axios";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { serverUrl, token } from "../Consts";
import Spinning from "../components/Spinning";
import * as Clipboard from "expo-clipboard";

const SuccessScreen = (props) => {
  const [qtoken, setqtoken] = useState(null);
  const [image, setImage] = useState(null);
  const [bank, setBank] = useState([]);
  const [inv_id, setInv_id] = useState(null);
  const [loading, setloading] = useState(false);

  const [mybank, setMybank] = useState("Хаан банк");
  const [dans, setDans] = useState("5084483969");
  const [dans_ner, setDans_ner] = useState("НЯМА БУМ ДАР ДОНДҮВ ЧОЙНХОРЛИН ХИЙД");
  const [iban, setIban] = useState("MN03000500");
  const [info, setInfo] = useState("");
  
  const copyToClipboard = async (val) => {
    await Clipboard.setStringAsync(val.toString());
    Alert.alert(`"${val}" утга амжилттай хууллаа!`);
  };

  useEffect(() => {
    let mount = true;
    axios
      .post(serverUrl + "get_bank.php", { token: token })
      .then((res) => {
        if (mount) {
          console.log(res.data);
          setMybank(res.data.bank);
          setDans(res.data.dans);
          setIban(res.data.iban);
          setDans_ner(res.data.dans_ner);
          setInfo(res.data.info);
          mount = false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      mount = false;
    };
  }, []);

  useEffect(() => {
    setloading(true);
    let mount = true;
    axios
      .post(serverUrl + "qpget.php", { token: token })
      .then((r) => {
        if (mount) {
          setqtoken(r.data[0].token);
          console.log(r.data[0].token);
          mount = false;
        }
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
        setloading(false);
      });
    return () => {
      mount = false;
      setloading(false);
    };
  }, []);

  useEffect(() => {
    setloading(true);
    let mount = true;
    if (qtoken !== null) {
      const config = {
        headers: { Authorization: `Bearer ${qtoken}` },
      };

      const bodyParameters = {
        invoice_code: "GANDANPUNTSOGLIN_INVOICE",
        sender_invoice_no: props.route.params.utga,
        invoice_description: "Айлтгалын дүн-" + props.route.params.utga,
        invoice_receiver_code: props.route.params.utga,
        amount: props.route.params.une,
        callback_url:
          "https://uvgandan.mn/adminl/qpayorder.php?payment_id=" +
          props.route.params.utga,
      };

      axios
        .post("https://merchant.qpay.mn/v2/invoice", bodyParameters, config)
        .then((data) => {
          setImage(data.data.qr_image);
          setBank(data.data.urls);
          setInv_id(data.data.invoice_id);
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    }
    return () => {
      mount = false;
      setloading(false);
    };
  }, [qtoken]);

  useEffect(() => {
    let mount = true;
    if (inv_id !== null) {
      axios
        .post(serverUrl + "inid.php", {
          inid: inv_id,
          zid: props.route.params.utga,
        })
        .then((data) => {})
        .catch((err) => console.log(err));
    }
    return () => {
      mount = false;
    };
  }, [inv_id]);

  const FirstRoute = () => (
    <ScrollView style={{ flex: 1, marginTop: 5 }}>
      {loading && <Spinning />}
      <Image
        style={{
          height: 150,
          width: 150,
          borderRadius: 10,
          alignSelf: "center",
          marginVertical: 15,
        }}
        source={{
          uri: `data:image/gif;base64,${image}`,
        }}
      />
      <View style={styles.qbank}>
        {bank.map((el) => (
          <TouchableOpacity
            key={el.name}
            onPress={() =>
              Linking.openURL(el.link).catch((err) =>
                Alert.alert(el.description + " аппликэйшн суугаагүй байна.")
              )
            }
            style={styles.bankl}
          >
            <Image
              style={{ height: 35, width: 35, borderRadius: 10 }}
              source={{
                uri: el.logo,
              }}
            />
            <Text style={{ marginHorizontal: 10 }}>{el.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const SecondRoute = () => (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.srow}>
        <Text>Банкны нэр: </Text>
      </View>
      <Text style={styles.btext}>{mybank}</Text>
      <View style={styles.srow}>
        <Text>Дансны нэр: </Text>
        <View style={styles.rrow}>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={() => copyToClipboard(`${dans_ner}`)}
          >
            <Text style={{ color: "#6e3102" }}>Дансны нэр хуулах</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.btext}>{dans_ner}</Text>
      <View style={styles.srow}>
        <Text>IBAN дугаар: </Text>
        <View style={styles.rrow}>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={() => copyToClipboard(`${iban}`)}
          >
            <Text style={{ color: "#6e3102" }}>IBAN дугаар хуулах</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.btext}>{iban}</Text>
      <View style={styles.srow}>
        <Text>Дансны дугаар: </Text>
        <View style={styles.rrow}>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={() => copyToClipboard(`${dans}`)}
          >
            <Text style={{ color: "#6e3102" }}>Дансны дугаар хуулах</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.btext}>{dans}</Text>
      <View style={styles.srow}>
        <Text>Гүйлгээний утга: </Text>
        <View style={styles.rrow}>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={() => copyToClipboard(props.route.params.utga)}
          >
            <Text style={{ color: "#6e3102" }}>Гүйлгээний утга хуулах</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.btext}>{props.route.params.utga}</Text>

      <View style={styles.srow}>
        <Text>Шилжүүлэх дүн: </Text>
      </View>
      <Text style={styles.btext}>{props.route.params.une}₮</Text>
      <View style={styles.info}>
        <Text style={styles.infoTxt}>{info}</Text>
      </View>
    </ScrollView>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "qPay" },
    { key: "second", title: "Шилжүүлэх" },
  ]);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headA}>
        <Text style={styles.stitle}> ТАНЫ ЗАХИАЛГА АМЖИЛТТАЙ ХИЙГДЛЭЭ</Text>
      </View>
      <View style={styles.main}>
        <TabView
          renderTabBar={(props) => (
            <TabBar
              {...props}
              renderLabel={({ route }) => (
                <Text
                  style={{
                    color: "rgba(24,23,23,0.8)",
                    margin: 8,
                    fontWeight: "bold",
                  }}
                >
                  {route.title}
                </Text>
              )}
              activeColor="#000000"
              inactiveColor="#000000"
              style={{ backgroundColor: "#e8e8e8", color: "#000000" }}
              indicatorStyle={{ backgroundColor: "#ffb300", height: 3 }}
            />
          )}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      </View>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  bankl: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    borderColor: "#A7ACB2",
    backgroundColor: "#f5f5f5ff",
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
  },
  qbank: {},
  infoTxt: {
    padding: 20,
    color: "#003d14",
  },
  info: {
    marginTop: 10,
    backgroundColor: "#dedede",
    borderRadius: 10,
  },
  rrow: {
    alignItems: "flex-end",
  },
  copyBtn: {
    backgroundColor: "#ffb300",
    padding: 5,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
  },
  btext: {
    flexWrap: "wrap",
    fontSize: 16,
    fontFamily: "Nunito_800ExtraBold",
  },
  main: {
    flex: 8,
    padding: 15,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40,
    marginHorizontal: 10,
    borderWidth: 0,
    backgroundColor: "#e8e8e8",
  },
  headA: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#ffb300",
  },
  stitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 18,
    textAlign: "center",
    padding: 15,
    color: "#fff",
    marginBottom: 40,
  },
  srow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
