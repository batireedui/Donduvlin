import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../Consts";
import JilOne from "../components/JilOne";
import { checkConnected } from "../function";
import NoConnectionScreen from "./NoConnectionScreen";
import Spinning from "../components/Spinning";
const ZasalScreen = ({ navigation }) => {
  const [connectStatus, setConnectStatus] = useState(false);
  const [jil, setJil] = useState(null);
  const [jilner, setJilner] = useState(null);
  const [arrOn, setArrOn] = useState(null);
  const [huis, setHuis] = useState(null);
  const [on, setOn] = useState(null);
  const [thison, setThison] = useState(null);
  const [loading, setloading] = useState(false);
  const [title, setTitle] = useState("");
  checkConnected().then((res) => {
    setConnectStatus(res);
  });
  useEffect(() => {
    let mount = true;
    setloading(true);
    axios
      .post(serverUrl + "zasalon.php")
      .then((data) => {
        if (mount) {
          console.log(data.data);
          setOn(data.data[0].starton);
          setThison(data.data[0].thison);
          setTitle(data.data[0].title);
          setloading(false);
        }
      })
      .catch((err) => {
        setloading(true);
        console.log(err);
      });
    return () => {
      mount = false;
    };
  }, []);

  const zasalNavi = () => {
    if (huis !== null) {
      navigation.navigate("ZasalinfoScreen", {
        jilner: jilner,
        on: arrOn,
        huis: huis,
        title: title,
      });
    }
  };

  let temp = [];
  function renderOn() {
    /*for (let i = parseInt(on) + jil; i <= parseInt(thison); i = i + 12) {
      temp.push(i);
    }*/
    console.log(on, thison, jil);

    let starton = parseInt(on) + ((jil - (parseInt(on) - 1923)) % 12);
    console.log(starton, thison, jil);
    if (starton < 0) starton += 12;

    for (let i = starton; i <= parseInt(thison); i = i + 12) {
      temp.push(i);
    }
  }

  return connectStatus ? (
    <View style={{ flex: 1, marginHorizontal: 15 }}>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          margin: 15,
          color: "#C9302C",
        }}
      >
        {title}
      </Text>
      <ScrollView>
        {loading && <Spinning />}
        <View style={{ marginHorizontal: 20 }}>
          <Text style={styles.subTitle}>Төрсөн жилээ сонгоно уу!</Text>
        </View>
        <View style={styles.row}>
          {jilArray.map((el, index) => (
            <JilOne
              key={index}
              imageName={el.imageName}
              ner={el.ner}
              onPress={() => {
                setJil(el.jil);
                setJilner(el.ner);
                setArrOn(null);
                setHuis(null);
              }}
            />
          ))}
        </View>
        {jil !== null ? renderOn() : null}
        {jil !== null ? (
          <View style={{ marginHorizontal: 20 }}>
            <Text style={styles.subTitle}>Төрсөн оноо сонгоно уу!</Text>
          </View>
        ) : null}
        <View style={styles.row}>
          {temp.map((el, index) => (
            <TouchableOpacity
              key={index}
              style={styles.Onbtn}
              onPress={() => {
                setArrOn(el);
                setHuis(null);
              }}
            >
              <Text>{el}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {arrOn !== null ? (
          <View style={{ marginHorizontal: 20 }}>
            <Text style={styles.subTitle}>Хүйс ээ сонгоно уу!</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 15,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.gender,
                  { backgroundColor: huis === "Эрэгтэй" ? "#EC971F" : "white" },
                ]}
                onPress={() => {
                  setHuis("Эрэгтэй");
                }}
              >
                <Text>Эрэгтэй</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gender,
                  { backgroundColor: huis === "Эмэгтэй" ? "#EC971F" : "white" },
                ]}
                onPress={() => {
                  setHuis("Эмэгтэй");
                }}
              >
                <Text>Эмэгтэй</Text>
              </TouchableOpacity>
            </View>
            {huis !== null ? (
              <TouchableOpacity
                style={styles.Onbtn}
                onPress={() => {
                  zasalNavi();
                }}
              >
                <Text style={{ fontWeight: "bold", color: "#fff" }}>
                  ЗАСЛАА ХАРАХ
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </View>
  ) : (
    <NoConnectionScreen onCheck={checkConnected} />
  );
};

export default ZasalScreen;
const styles = StyleSheet.create({
  gender: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EC971F",
    paddingHorizontal: 30,
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  subTitle: {
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "bold",
    color: "#C9302C",
  },
  Onbtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 8,
    borderRadius: 10,
    backgroundColor: "#EC971F",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});

const jilArray = [
  {
    imageName: require("../../assets/12jil/1jil.png"),
    jil: 1,
    ner: "Хулгана",
  },
  {
    imageName: require("../../assets/12jil/2jil.png"),
    jil: 2,
    ner: "Үхэр",
  },
  {
    imageName: require("../../assets/12jil/3jil.png"),
    jil: 3,
    ner: "Бар",
  },
  {
    imageName: require("../../assets/12jil/4jil.png"),
    jil: 4,
    ner: "Туулай",
  },
  {
    imageName: require("../../assets/12jil/5jil.png"),
    jil: 5,
    ner: "Луу",
  },
  {
    imageName: require("../../assets/12jil/6jil.png"),
    jil: 6,
    ner: "Могой",
  },
  {
    imageName: require("../../assets/12jil/7jil.png"),
    jil: 7,
    ner: "Морь",
  },
  {
    imageName: require("../../assets/12jil/8jil.png"),
    jil: 8,
    ner: "Хонь",
  },
  {
    imageName: require("../../assets/12jil/9jil.png"),
    jil: 9,
    ner: "Бич",
  },
  {
    imageName: require("../../assets/12jil/10jil.png"),
    jil: 10,
    ner: "Тахиа",
  },
  {
    imageName: require("../../assets/12jil/11jil.png"),
    jil: 11,
    ner: "Нохой",
  },
  {
    imageName: require("../../assets/12jil/12jil.png"),
    jil: 12,
    ner: "Гахай",
  },
];
