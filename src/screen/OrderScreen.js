import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { checkConnected } from "../function";
import NoConnectionScreen from "./NoConnectionScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { serverUrl } from "../Consts";
import Spinning from "../components/Spinning";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MyInput from "../components/MyInput";
import { token } from "../Consts";
const OrderScreen = ({ navigation }) => {
  const [connectStatus, setConnectStatus] = useState(false);
  const [books, setBooks] = useState([]);
  const [firstbooks, setFirstbooks] = useState(true);
  const [loading, setloading] = useState(false);
  const [insertW, setInsertW] = useState(false);
  const [une, setune] = useState(0);
  const [findValue, setfindValue] = useState("");
  const [hens, setHens] = useState(null);
  const [hend, setHend] = useState(null);
  const [utas, setUtas] = useState(null);
  const [price, setPrice] = useState(0);
  const [selectbook, setselectbook] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [info, setinfo] = useState("");
  const [flash, setFlash] = useState("");
  const [suseg, setSuseg] = useState(0);
  checkConnected().then((res) => {
    setConnectStatus(res);
  });

  useEffect(() => {
    getData();
    return () => {};
  }, []);

  useEffect(() => {
    let mount = true;
    axios
      .post(serverUrl + "price.php")
      .then((data) => {
        if (mount) {
          setPrice(data.data[0].price);
        }
      })
      .catch((err) => console.log(err));
    return () => {
      mount = false;
    };
  }, []);

  useEffect(() => {
    let mount = true;
    axios
      .post(serverUrl + "get_info.php")
      .then((data) => {
        if (mount) {
          setFlash(data.data);
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
    setFirstbooks(false);
    let mount = true;
    setloading(true);
    axios
      .post(serverUrl + "book_app.php")
      .then((data) => {
        if (mount) {
          setBooks(data.data);
          setHens(null);
          setHend(null);
          setune(0);
          setselectbook(0);
          setinfo(null);
          setModalVisible(false);
          setloading(false);
          setFirstbooks(true);
        }
      })
      .catch((err) => console.log(err));
    return () => {
      mount = false;
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setFirstbooks(false);
      let mount = true;
      setloading(true);
      axios
        .post(serverUrl + "book_app.php")
        .then((data) => {
          if (mount) {
            setBooks(data.data);
            setHens(null);
            setHend(null);
            setune(0);
            setselectbook(0);
            setinfo(null);
            setModalVisible(false);
            setloading(false);
            setFirstbooks(true);
            setInsertW(false);
          }
        })
        .catch((err) => console.log(err));
      return () => {
        mount = false;
      };
    }, []),
  );

  //let filterBook = books;
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

  let filterBook = books.filter((el) =>
    el.name.toLowerCase().includes(findValue.toLowerCase()),
  ); // Хайлт
  let aildNom = books.filter((el) => el.checked.includes("true")); //Сонгосон номын Modal харагдах массив
  let zid = aildNom.map((el) => el.id); //Сонгосон номын ID массив
  let okok = 0;
  const insertScr = () => {
    console.log("prs");
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
            niitdun: suseg, //parseInt(une) + parseInt(price),
            zahid: zid,
          })
          .then((data) => {
            console.log(data.data);
            const response = data.data;
            console.log(response.zdugaar);
            if (response.success === true) {
              okok = 0;
              setModalVisible(false);
              navigation.navigate("SuccessScreen", {
                utga: response.zdugaar,
                qpay: response.qpay,
                une: suseg, //parseInt(une) + parseInt(price),
              });
            } else {
              setinfo("Дахин оролдоно уу!");
              setInsertW(false);
              okok = 0;
            }
            /*
            if (data.data.indexOf("okok") > -1) {
              okok = 0;
              setModalVisible(false);
              navigation.navigate("SuccessScreen", {
                utga: data.data.substring(4, data.data.length),
                une: suseg, //parseInt(une) + parseInt(price),
              });
            } else {
              setinfo("Дахин оролдоно уу!");
              setInsertW(false);
              okok = 0;
            }
              */
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
    const amount = Number(suseg);
    if (hens === null) {
      chv = false;
      setinfo("Хэнээс талбарыг оруулна уу");
    } else if (hend === null) {
      chv = false;
      setinfo("Хэнд/Ам бүл талбарыг оруулна уу");
    } else if (!suseg || !Number.isInteger(amount) || amount < 100) {
      chv = false;
      setinfo("Сүсэглэх дүн 100-аас дээш бүхэл тоо байх ёстой");
    } else if (chn === null) {
      chv = false;
      setinfo("Утасны дугаараа оруулна уу");
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
    <View>
      {flash !== "" ? (
        <View style={styles.flash}>
          <Text style={{ padding: 8, fontSize: 12 }}>{flash}</Text>
        </View>
      ) : null}
      <View style={styles.Inputv}>
        <FontAwesome
          name="search"
          size={24}
          color="#727272"
          style={{ marginHorizontal: 5 }}
        />
        <TextInput
          placeholder="Хайх номын нэр"
          style={styles.Input}
          value={findValue}
          onChangeText={setfindValue}
          //onEndEditing = {search}
        />
      </View>
      <View style={styles.rowd}>
        <Text
          style={{
            padding: 10,
            alignItems: "flex-start",
            flex: 3,
            fontFamily: "RobotoCondensed_600SemiBold",
          }}
        >
          Сонгосон айлтгал, ерөөл: {selectbook}
        </Text>
        {/*
        <Text
          style={{
            padding: 10,
            alignSelf: "flex-end",
            flex: 2,
            fontFamily: "RobotoCondensed_600SemiBold",
          }}
        >
          Дүн: {une}
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
            <Text
              style={{
                color: "#ffffff",
                fontFamily: "RobotoCondensed_600SemiBold",
                fontSize: 14,
              }}
            >
              АЙЛДУУЛАХ
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 12,
                color: "#ffffff",
                fontFamily: "RobotoCondensed_600SemiBold",
              }}
            >
              Номоо сонгоно уу
            </Text>
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
                  <Text style={styles.info}>
                    {el.une == "0" ? "Сүсгээрээ" : el.une + " ₮"}
                  </Text>
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.buttonClose}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text
                  style={{ color: "#ffffff", fontWeight: "bold", padding: 10 }}
                >
                  X
                </Text>
              </TouchableOpacity>
              <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                ТАНЫ АЙЛТГАЛУУД
              </Text>
              <View style={{ maxHeight: 100 }}>
                <ScrollView>
                  {aildNom.map((el) => (
                    <Text key={el.name}>{el.name}</Text>
                  ))}
                </ScrollView>
              </View>
              {/*
            <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                <Text style={{ fontSize: 10 }}>Айлтгалын дүн: {une}₮</Text>
                <Text style={{ fontSize: 10 }}>Онлайн захиалгын шимтгэл: {price}₮</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>ТАНЫ ТӨЛӨХ ДҮН: {parseInt(une) + parseInt(price)}₮</Text>
            </View>
            */}

              <MyInput
                style={styles.popText}
                placeholder="Бат"
                value={hens}
                onChangeText={setHens}
                labelName="Хэнээс"
              />
              <MyInput
                style={styles.popText}
                placeholder="Ам бүл 5"
                value={hend}
                onChangeText={setHend}
                labelName="Хэнд/Ам бүл"
              />
              <MyInput
                style={[styles.popText, { marginBottom: 10 }]}
                placeholder="Энд утасны дугаар"
                keyboardType="numeric"
                value={utas}
                maxLength={8}
                onChangeText={setUtas}
                labelName="Утасны дугаар"
              />
              <MyInput
                style={[styles.popText, { marginBottom: 10 }]}
                placeholder="Энд сүсэглэх дүн"
                keyboardType="numeric"
                value={suseg}
                onChangeText={setSuseg}
                labelName="Сүсэглэх дүн"
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
        </KeyboardAvoidingView>
      </Modal>
    </View>
  ) : (
    <NoConnectionScreen onCheck={checkConnected} />
  );
};
export default OrderScreen;
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
    backgroundColor: "#ca4e18",
  },
  buttonClose: {
    alignSelf: "flex-end",
    marginTop: -30,
    marginRight: -30,
    backgroundColor: "#ca4e18",
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
    backgroundColor: "#ca4e18",
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    height: 30,
    flex: 1,
    color: "#fff",
  },
  rowd: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  flash: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    backgroundColor: "#d9edf7",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0dcaf0",
    marginTop: 15,
  },
  desc: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginTop: 3,
    fontFamily: "RobotoCondensed_400Regular",
    color: "#383838",
    fontSize: 14,
  },
  Bookname: {
    flexDirection: "row",
    flex: 8,
    fontWeight: "bold",
    fontFamily: "RobotoCondensed_600SemiBold",
    color: "#321111",
    fontSize: 16,
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
  Inputv: {
    flexDirection: "row",
    margin: 15,
    borderColor: "#999999",
    borderWidth: 2,
    borderRadius: 15,
    alignItems: "center",
    padding: 8,
  },
  info: {
    flexDirection: "row",
    flex: 2,
    alignItems: "center",
    fontFamily: "RobotoCondensed_600SemiBold",
    color: "#383838",
    fontSize: 14,
    //backgroundColor: '#005cad',
  },
});
