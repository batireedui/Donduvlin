import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
const NoConnectionScreen = (props) => {
  return (
    <View style={styles.container}>
      <Feather name="wifi-off" size={60} color="#f03f35" />
      <Text style={{ color: "#f03f35" }}>Та сүлжээгээ шалгана уу!</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default NoConnectionScreen