import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderScreen from './src/screen/OrderScreen';
import CheckScreen from './src/screen/CheckScreen';
import HomeScreen from './src/screen/HomeScreen';
import { PhoneValue } from './src/context/PhoneContext';
import SuccessScreen from './src/screen/SuccessScreen';
import ContactScreen from './src/screen/ContactScreen';
import InsertOrderScreen from './src/screen/InsertOrderScreen';
import HelpScreen from './src/screen/HelpScreen';
import TodayScreen from './src/screen/TodayScreen';
import ZasalScreen from './src/screen/ZasalScreen';
import ZasalinfoScreen from './src/screen/ZasalinfoScreen';
import EbarimtShowScreen from './src/screen/EbarimtShowScreen';
import ZasalwebScreen from './src/screen/ZasalwebScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PhoneValue>
        <Stack.Navigator initialRouteName="HomeScreen"
          screenOptions={{
            headerStyle: { backgroundColor: "#ca4e18", borderWidth: 0, elevation: 0, shadowColor: 'transparent', shadowOpacity: 0 },
            headerTintColor: "white",
            headerBackTitle: "Буцах",
            headerTitleStyle: { fontSize: 18 }
          }}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OrderScreen" component={OrderScreen} options={{ title: "Ном айлдуулах" }} />
          <Stack.Screen name="CheckScreen" component={CheckScreen} options={{ title: "Захиалга шалгах" }} />
          <Stack.Screen name="SuccessScreen" component={SuccessScreen} options={{ title: "Захиалга амжилттай" }} />
          <Stack.Screen name="InsertOrderScreen" component={InsertOrderScreen} options={{ title: "Айлтгалыг бүртгэж байна" }} />
          <Stack.Screen name="ContactScreen" component={ContactScreen} options={{ title: "Холбоо барих" }} />
          <Stack.Screen name="HelpScreen" component={HelpScreen} options={{ title: "Заавар" }} />
          <Stack.Screen name="TodayScreen" component={TodayScreen} options={{ title: "Өнөөдөр" }} />
          <Stack.Screen name="ZasalScreen" component={ZasalScreen} options={{ title: "Суудлын засал" }} />
          <Stack.Screen name="ZasalinfoScreen" component={ZasalinfoScreen} options={{ title: "Суудлын засал" }} />
          <Stack.Screen name="EbarimtShowScreen" component={EbarimtShowScreen} options={{ title: "Ebarimt" }} />
          <Stack.Screen name="ZasalwebScreen" component={ZasalwebScreen} options={{ title: "Суудлын засал" }} />
        </Stack.Navigator>
      </PhoneValue>
    </NavigationContainer>
  );
}
