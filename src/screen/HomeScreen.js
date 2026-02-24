import React, { useState, useEffect, useRef } from "react";
import {
  ImageBackground,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  View,
  Platform,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFonts } from "expo-font";
import { Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import { RobotoCondensed_100Thin } from "@expo-google-fonts/roboto-condensed/100Thin";
import { RobotoCondensed_200ExtraLight } from "@expo-google-fonts/roboto-condensed/200ExtraLight";
import { RobotoCondensed_300Light } from "@expo-google-fonts/roboto-condensed/300Light";
import { RobotoCondensed_400Regular } from "@expo-google-fonts/roboto-condensed/400Regular";
import { RobotoCondensed_500Medium } from "@expo-google-fonts/roboto-condensed/500Medium";
import { RobotoCondensed_600SemiBold } from "@expo-google-fonts/roboto-condensed/600SemiBold";
import { RobotoCondensed_700Bold } from "@expo-google-fonts/roboto-condensed/700Bold";
import { RobotoCondensed_800ExtraBold } from "@expo-google-fonts/roboto-condensed/800ExtraBold";
import { RobotoCondensed_900Black } from "@expo-google-fonts/roboto-condensed/900Black";
import { RobotoCondensed_100Thin_Italic } from "@expo-google-fonts/roboto-condensed/100Thin_Italic";
import { RobotoCondensed_200ExtraLight_Italic } from "@expo-google-fonts/roboto-condensed/200ExtraLight_Italic";
import { RobotoCondensed_300Light_Italic } from "@expo-google-fonts/roboto-condensed/300Light_Italic";
import { RobotoCondensed_400Regular_Italic } from "@expo-google-fonts/roboto-condensed/400Regular_Italic";
import { RobotoCondensed_500Medium_Italic } from "@expo-google-fonts/roboto-condensed/500Medium_Italic";
import { RobotoCondensed_600SemiBold_Italic } from "@expo-google-fonts/roboto-condensed/600SemiBold_Italic";
import { RobotoCondensed_700Bold_Italic } from "@expo-google-fonts/roboto-condensed/700Bold_Italic";
import { RobotoCondensed_800ExtraBold_Italic } from "@expo-google-fonts/roboto-condensed/800ExtraBold_Italic";
import { RobotoCondensed_900Black_Italic } from "@expo-google-fonts/roboto-condensed/900Black_Italic";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { token } from "../Consts";
import { serverUrl } from "../Consts";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const HomeScreen = ({ navigation }) => {
  const [phonevalue, setphonevalue] = useState(true);
  const [sphone, setsphone] = useState(null);
  const [day, setday] = useState(null);
  const [info, setinfo] = useState("");
  const [signOutClick, setsignOutClick] = useState(false);
  /*notifaction*/
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);



  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(error));

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    let mount = true;
    axios
      .post(serverUrl + "day.php")
      .then((data) => {
        if (mount) {
          setday(data.data);
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
    axios
      .post(serverUrl + "newtoken.php", {
        token: token,
        expotoken: expoPushToken,
        phonevalue: phonevalue,
      })
      .then((data) => {
        console.log(data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => { };
  }, [expoPushToken]);

  /*notifaction*/
  useEffect(() => {
    //AsyncStorage.removeItem("@phoneVal");
    getData();
    return () => { };
  }, [phonevalue]);

  useEffect(() => {
    if (phonevalue) {
      axios
        .post(serverUrl + "tokenphone.php", {
          token: token,
          expotoken: expoPushToken,
          phone: sphone,
        })
        .then((data) => { })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => { };
  }, [phonevalue, expoPushToken]);

  const version = "1.0.0";
  function checkNumber(chn) {
    let chv = true;
    if (chn === null) {
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

  const savePhone = async () => {
    if (checkNumber(sphone)) {
      try {
        await AsyncStorage.setItem("@phoneVal", sphone);
        setphonevalue(true);
      } catch (e) {
        setphonevalue(false);
        setinfo("Дахин оролдоно уу!");
      }
    } else {
      setphonevalue(false);
      setinfo("Утасны дугаараа оруулан хадгална уу!");
    }
  };

  const removePhone = async () => {
    try {
      await AsyncStorage.removeItem("@phoneVal");
      setphonevalue(false);
      setsignOutClick(!signOutClick);
    } catch (e) { }
  };

  const signOutDrop = () => {
    setsignOutClick(!signOutClick);
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@phoneVal");
      if (value !== null) {
        setsphone(value);
        setphonevalue(true);
      }
    } catch (e) {
      setphonevalue(false);
      // error reading value
    }
  };

  let [fontsLoaded] = useFonts({
    Nunito_800ExtraBold,
    RobotoCondensed_100Thin,
    RobotoCondensed_200ExtraLight,
    RobotoCondensed_300Light,
    RobotoCondensed_400Regular,
    RobotoCondensed_500Medium,
    RobotoCondensed_600SemiBold,
    RobotoCondensed_700Bold,
    RobotoCondensed_800ExtraBold,
    RobotoCondensed_900Black,
    RobotoCondensed_100Thin_Italic,
    RobotoCondensed_200ExtraLight_Italic,
    RobotoCondensed_300Light_Italic,
    RobotoCondensed_400Regular_Italic,
    RobotoCondensed_500Medium_Italic,
    RobotoCondensed_600SemiBold_Italic,
    RobotoCondensed_700Bold_Italic,
    RobotoCondensed_800ExtraBold_Italic,
    RobotoCondensed_900Black_Italic,
  });
  if (!fontsLoaded) {
    return (
      <View style={styles.centertxt}>
        <Text>Түр хүлээнэ үү ...</Text>
      </View>
    );
  } else {
    return phonevalue ? (
      <ImageBackground
        source={require("../../assets/bg.jpg")}
        style={styles.image}
      >
        {sphone === null ? null : (
          <>
            <Pressable style={styles.myNumber} onPress={signOutDrop}>
              <Text style={styles.titleP}>{sphone}</Text>
              <Feather name="arrow-down-circle" size={20} color="white" />
            </Pressable>

            {signOutClick && (
              <Pressable style={styles.myNumberD} onPress={removePhone}>
                <Text style={styles.titleP}>Дугаар солих</Text>
              </Pressable>
            )}
          </>
        )}
        <View style={styles.cont}>
          <View>
            <Text style={styles.title}>ДОНДҮВЛИН ХИЙД</Text>
          </View>
          {day === null ? null : (
            <View style={styles.ognoob}>
              <Text style={styles.ognoo}>{day}</Text>
            </View>
          )}
          <View style={styles.contD}>
            <Pressable
              style={styles.mainBtn}
              onPress={() => navigation.navigate("OrderScreen")}
            >
              <View style={styles.circle}>
                <AntDesign name="read" size={24} color="#fff" />
              </View>
              <Text style={styles.textStyle}>Ном айлдуулах</Text>
            </Pressable>
            <Pressable
              style={styles.mainBtn}
              onPress={() => {
                navigation.navigate("ZasalScreen");
              }}
            >
              <View style={styles.circle}>
                <Feather name="user" size={24} color="#fff" />
              </View>
              <Text style={styles.textStyle}>Засал</Text>
            </Pressable>
          </View>
          <View style={styles.contD}>
            <Pressable
              style={styles.mainBtn}
              onPress={() => navigation.navigate("CheckScreen")}
            >
              <View style={styles.circle}>
                <AntDesign name="contacts" size={24} color="#fff" />
              </View>
              <Text style={styles.textStyle}>Миний айлтгалууд</Text>
            </Pressable>
            <Pressable
              style={styles.mainBtn}
              onPress={() => navigation.navigate("TodayScreen")}
            >
              <View style={styles.circle}>
                <AntDesign name="calendar" size={24} color="#fff" />
              </View>
              <Text style={styles.textStyle}>Өнөөдөр</Text>
            </Pressable>
          </View>
          <View style={styles.contD}>
            <Pressable
              style={styles.mainBtn}
              onPress={() => navigation.navigate("HelpScreen")}
            >
              <View style={styles.circle}>
                <Feather name="help-circle" size={24} color="#fff" />
              </View>
              <Text style={styles.textStyle}>Заавар</Text>
            </Pressable>
            <Pressable
              style={styles.mainBtn}
              onPress={() => navigation.navigate("ContactScreen")}
            >
              <View style={styles.circle}>
                <AntDesign name="phone" size={24} color="#fff" />
              </View>
              <Text style={styles.textStyle}>Холбоо барих</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 10, color: "#5A5A5A" }}>
            Хувилбар: {version}
          </Text>
        </View>
      </ImageBackground>
    ) : (
      <View style={styles.centertxt}>
        <View style={{ justifyContent: "center", flex: 10 }}>
          <Text style={styles.textStyle}>Утасны дугаараа оруулна уу</Text>
          <TextInput
            style={styles.Inputp}
            keyboardType="numeric"
            maxLength={8}
            value={sphone}
            onChangeText={setsphone}
          />
          <Text style={{ fontSize: 10, marginBottom: 10, color: "red" }}>
            {info}
          </Text>
          <Pressable style={styles.buttonS} onPress={savePhone}>
            <Text
              style={{
                fontWeight: "bold",
                color: "#ffffff",
                textAlign: "center",
              }}
            >
              Хадгалах
            </Text>
          </Pressable>
        </View>
        <View style={{ justifyContent: "flex-end", flex: 1, marginBottom: 10 }}>
          <Text style={{ fontSize: 10, color: "#5A5A5A" }}>
            Хувилбар: {version}
          </Text>
        </View>
      </View>
    );
  }
};

export default HomeScreen;

function handleRegistrationError(errorMessage) {
  console.log(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Push notification зөвшөөрөл авч чадсангүй!",
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(e);
    }
  } else {
    handleRegistrationError("Физик төхөөрөмж дээр ажиллуулах шаардлагатай!");
  }
}

const styles = StyleSheet.create({
  line: {
    marginTop: 5,
    height: 3,
    width: 120,
    borderRadius: 5,
  },
  titleP: {
    display: "flex",
    fontFamily: "Nunito_800ExtraBold",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  myNumber: {
    alignSelf: "flex-end",
    backgroundColor: "#e05c04",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginRight: 10,
    marginTop: 50,
    flexDirection: "row",
    width: 150,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  myNumberD: {
    alignSelf: "flex-end",
    backgroundColor: "#f47d15",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginRight: 10,
    textAlign: "center",
    flexDirection: "row",
    width: 150,
  },
  buttonS: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    backgroundColor: "#ffb300",
  },
  Inputp: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: "#ff7700",
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 20,
    backgroundColor: "#f0f9ff",
    width: 230,
  },
  centertxt: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    paddingBottom: 30,
  },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    color: "#e05c04",
    fontSize: 22,
    textAlign: "center",
    textShadowColor: "#fff",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
  },
  textStyle: {
    fontFamily: "RobotoCondensed_500Medium",
    color: "#321111",
  },
  circle: {
    marginTop: 10,
    marginBottom: 5,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f6b74b",
  },
  cont: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  contD: {
    //flex: 1,
    flexDirection: "row",
  },
  mainBtn: {
    borderWidth: 2,
    borderColor: "#e59797",
    marginHorizontal: 15,
    marginVertical: 10,
    alignItems: "center",
    width: 155,
    height: 105,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
  },
  ognoo: {
    fontFamily: "RobotoCondensed_500Medium",
    color: "#e05c04",
    fontSize: 12,
    textAlign: "center",
  },
  ognoob: {
    backgroundColor: "#fde79e",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 15,
  },
});
