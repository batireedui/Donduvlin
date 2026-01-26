import React from 'react'
import { StyleSheet, View, ActivityIndicator,Text } from 'react-native'

const Spinning = () => {
    return (
        <View style={{ alignItems: "center", marginTop: 30 }}>
            <ActivityIndicator size="large" color="#ffb300" />
            <Text style={{color: "#ff7700" }}>Түр хүлээнэ үү ...</Text>
        </View>
    )
}

export default Spinning

const styles = StyleSheet.create({})
