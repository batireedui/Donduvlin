import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import RenderHtml from "react-native-render-html";

import { checkConnected } from "../function";
import NoConnectionScreen from "./NoConnectionScreen";
import { serverUrl } from "../Consts";
import Spinning from "../components/Spinning";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MyInput from "../components/MyInput";
import { token } from "../Consts";
const ZasalinfoScreen = (props) => {
  const { width } = useWindowDimensions();
  const [connectStatus, setConnectStatus] = useState(false);
  const [books, setBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [insertW, setInsertW] = useState(false);
  const [une, setune] = useState(0);
  //const [tai, settai] = useState([]);
  const [tailbar, setTailbar] = useState("");
  const [hens, setHens] = useState(null);
  const [hend, setHend] = useState(null);
  const [utas, setUtas] = useState(null);
  const [price, setPrice] = useState(0);
  const [selectbook, setselectbook] = useState(0);
  const [info, setinfo] = useState("");
  const [main, setmain] = useState(null);
  const [firstbooks, setFirstbooks] = useState(true);
  const [suudal, setSuudal] = useState("");
  checkConnected().then((res) => {
    setConnectStatus(res);
  });

  useEffect(() => {
    setHend(
      "ЗАСАЛ: Жил:" +
        props.route.params.jilner +
        ", Төрсөн он: " +
        props.route.params.on +
        ", Хүйс: " +
        props.route.params.huis,
    );
    getData();
    return () => {};
  }, []);

  useEffect(() => {
    let mount = true;
    axios
      .post(serverUrl + "price.php")
      .then((data) => {
        if (mount) {
          setPrice(data.data[0].pricezasal);
        }
      })
      .catch((err) => console.log(err));
    return () => {
      mount = false;
    };
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@phoneVal");
      if (value !== null) {
        setUtas(value);
      }
    } catch (e) {}
  };

  useEffect(() => {
    console.log(props.route.params);
    console.log(serverUrl);

    setFirstbooks(false);

    let mount = true;
    setloading(true);
    axios
      .post(serverUrl + "zasalapi.php", {
        jilv: props.route.params.jilner,
        on: props.route.params.on,
        huis: props.route.params.huis,
      })
      .then((data) => {
        console.log(data.data);

        if (mount) {
          setBooks(data.data.nom);
          setHens(null);
          //setune(data.data[3]);
          setTailbar(data.data.tailbar);
          setSuudal(data.data.suudalner);
          setselectbook(data.data.nom.length);
          setinfo(null);
          setModalVisible(false);
          setloading(false);
          setFirstbooks(true);
          //settai(data.data[1][0]);
        }
      })
      .catch((err) => console.log(err));
    return () => {
      mount = false;
    };
  }, []);
  const bookCheck = (id) => {
    let ntoo = selectbook;
    let unes = une;
    let data = books;
    const index = data.findIndex((x) => x.id === id);
    if (data[index].checked === "true") {
      data[index].checked = "false";
      ntoo--;
      unes = unes - parseInt(data[index].une);
    } else {
      data[index].checked = "true";
      ntoo++;
      unes = unes + parseInt(data[index].une);
    }

    setBooks(data);
    setune(unes);
    setselectbook(ntoo);
  };

  let filterBook = books; // Хайлт
  let aildNom = books.filter((el) => el.checked.includes("true")); //Сонгосон номын Modal харагдах массив
  let zid = aildNom.map((el) => el.id); //Сонгосон номын ID массив
  let okok = 0;
  const insertScr = () => {
    if (checkNumber(utas)) {
      setInsertW(true);
      if (okok == 0) {
        okok = 1;
        axios
          .post(serverUrl + "insertapi.php", {
            token: token,
            hens: hens,
            hend: hend,
            utas: utas,
            niitdun: parseInt(une) + parseInt(price),
            zahid: zid,
          })
          .then((data) => {
            console.log(data.data);
            const response = data.data;
            console.log(response.zdugaar);
            if (response.success === true) {
              okok = 0;
              setModalVisible(false);
              props.navigation.navigate("SuccessScreen", {
                utga: response.zdugaar,
                qpay: response.qpay,
                une: parseInt(une) + parseInt(price),
              });
            } else {
              setinfo("Дахин оролдоно уу!");
              setInsertW(false);
              okok = 0;
            }
          })
          .catch((err) => {
            console.log(err);
            okok = 0;
            setInsertW(false);
            setinfo("Алдаа гарлаа! Дахин оролдоно уу.");
          });
      } else console.log(okok);
    }
  };

  function checkNumber(chn) {
    let chv = true;
    if (hens === null) {
      chv = false;
      setinfo("Нэрээ оруулна уу");
    } else if (chn === null) {
      chv = false;
      setinfo("Утасны дугаараа оруулна уу");
    } else if (!Number.isInteger(parseInt(une)) || parseInt(une) < 100) {
      chv = false;
      setinfo("Сүсэглэх дүн 100-аас дээш бүхэл тоо байх ёстой");
    } else if (chn.length < 8) {
      chv = false;
      setinfo("Утасны дугаараа зөв оруулна уу!");
    } else if (chn.length === 8) {
      let newText = "";
      let numbers = "0123456789";
      for (var i = 0; i < chn.length; i++) {
        if (numbers.indexOf(chn[i]) > -1) {
          newText = newText + chn[i];
        } else {
          chv = false;
          setinfo("Утасны дугаараа зөв оруулна уу!");
        }
      }
      console.log(newText);
    } else {
      chv = false;
      setinfo("Утасны дугаараа зөв оруулна уу!");
    }

    if (chv) return true;
    else return false;
  }
  return connectStatus ? (
    <ScrollView>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          margin: 15,
          color: "#C9302C",
        }}
      >
        {props.route.params.title}
      </Text>
      <View style={styles.headTop}>
        <FontAwesome name="user" size={24} color="#fff" />
        <Text style={{ color: "#fff", margin: 10, fontWeight: "bold" }}>
          Жил: {props.route.params.jilner}, Төрсөн он: {props.route.params.on},
          Хүйс: {props.route.params.huis}
        </Text>
      </View>
      <View style={styles.head}>
        <Text style={styles.tg}>Суудал: {suudal}</Text>
        <RenderHtml
          contentWidth={width}
          tagsStyles={{
            h4: { fontSize: 15, fontWeight: "bold" },
            b: { fontWeight: "bold" },
          }}
          
          source={{ html: tailbar }}
        />
      </View>
      {/*
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
        }}
      >
        <Text>Сонгосон ном: {selectbook}</Text>
        <Text>Дүн: {parseInt(une) + parseInt(price)} </Text>
      </View>
      */}
      <View style={{ paddingHorizontal: 10, alignItems: "flex-end" }}>
        {/*
        <Text style={{ fontSize: 10 }}>
          Онлайн захиалгын {price} төгрөг нэмэгдсэн
        </Text>
        */}
        <TouchableOpacity
          disabled={selectbook > 0 ? false : true}
          onPress={() => {
            setModalVisible(true);
          }}
          style={styles.ailduulah}
        >
          {selectbook > 0 ? (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>ЗАСЛЫН НОМ АЙЛДУУЛАХ</Text>
          ) : (
            <Text style={{ fontSize: 12, color: "#999" }}>Номоо сонгоно уу</Text>
          )}
        </TouchableOpacity>
      </View>
      {loading && <Spinning />}
      {firstbooks ? (
        <ScrollView style={styles.bookList}>
          {filterBook.map((el) => (
            <TouchableOpacity
              key={el.id}
              style={styles.BookStyle}
              onPress={() => {
                bookCheck(el.id);
              }}
            >
              {el.checked == "true" ? (
                <FontAwesome
                  style={styles.checkStyle}
                  name="check-circle"
                  size={24}
                  color="#005cad"
                />
              ) : null}
              <View style={{ flexDirection: "column", flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.Bookname}>{el.name}</Text>
                  <Text style={styles.info}>{el.une} ₮</Text>
                </View>
                <Text style={styles.desc}>{el.tailbar}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={{ color: "#000", fontWeight: "bold", padding: 10 }}>
                X
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalText, { fontWeight: "bold" }]}>
              ТАНЫ АЙЛТГАЛУУД
            </Text>
            <View style={{ maxHeight: 100 }}>
              <ScrollView>
                {aildNom !== null
                  ? aildNom.map((el) => <Text key={el.name}>{el.name}</Text>)
                  : null}
              </ScrollView>
            </View>
            {/*
            <View style={{ alignItems: "flex-end", marginTop: 10 }}>
              <Text style={{ fontSize: 10 }}>Айлтгалын дүн: {une}₮</Text>
              <Text style={{ fontSize: 10 }}>
                Онлайн захиалгын шимтгэл: {price}₮
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                ТАНЫ ТӨЛӨХ ДҮН: {parseInt(une) + parseInt(price)}₮
              </Text>
            </View>*/}
            <MyInput
              style={styles.popText}
              placeholder="Бат"
              value={hens}
              onChangeText={setHens}
              labelName="Засал хийлгэх хүний нэр"
            />
            <MyInput
              style={styles.popText}
              value={une}
              onChangeText={setune}
              labelName="Сүсэглэх дүн"
              keyboardType="numeric"
            />
            <MyInput
              style={[styles.popText, { marginBottom: 10 }]}
              placeholder="Утасны дугаар"
              keyboardType="numeric"
              value={utas}
              maxLength={8}
              onChangeText={setUtas}
              labelName="Таны утасны дугаар"
            />
            <Text style={{ fontSize: 10, marginBottom: 10, color: "red" }}>
              {info}
            </Text>
            {insertW ? (
              <Spinning />
            ) : (
              <TouchableOpacity style={styles.button} onPress={insertScr}>
                <Text style={styles.textStyle}>Онлайнаар төлөх</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  ) : (
    <NoConnectionScreen onCheck={checkConnected} />
  );
};

export default ZasalinfoScreen;

const styles = StyleSheet.create({
  popText: {
    width: 200,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    backgroundColor: "#ffb300",
  },
  buttonClose: {
    alignSelf: "flex-end",
    marginTop: -30,
    marginRight: -30,
    backgroundColor: "#ffb300",
    borderRadius: 30,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  ailduulah: {
    backgroundColor: "#ff7b00",
    paddingHorizontal: 15,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 30,
    flex: 3,
  },
  rowd: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  desc: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginTop: 3,
  },
  Bookname: {
    flexDirection: "row",
    flex: 8,
    fontWeight: "bold",
  },
  BookStyle: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: "center",
    backgroundColor: "#e8e8e8",
    borderRadius: 15,
    marginVertical: 5,
    borderColor: "#d3d3d3",
    borderWidth: 1,
  },
  bookList: {
    paddingHorizontal: 10,
    marginBottom: 55,
  },
  checkStyle: {
    marginRight: 15,
  },
  Input: {
    flex: 1,
  },
  tg: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#664D03",
  },
  tp: {
    color: "#664D03",
  },
  Inputv: {
    flexDirection: "row",
    margin: 15,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    padding: 5,
  },
  info: {
    flexDirection: "row",
    flex: 2,
    alignItems: "center",
    fontWeight: "bold",
    //backgroundColor: '#005cad',
  },
  head: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFF3CD",
  },
  headl: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#374AA9",
  },
  headTop: {
    margin: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#861f00",
    borderRadius: 5,
  },
});
