import React from 'react'
import { StyleSheet, View, ActivityIndicator,Text } from 'react-native'

const Spinning = () => {
    return (
        <View style={{ alignItems: "center", marginTop: 30 }}>
            <ActivityIndicator size="large" color="#ca4e18" />
            <Text style={{color: "#ca4e18" }}>Түр хүлээнэ үү ...</Text>
        </View>
    )
}

export default Spinning

const styles = StyleSheet.create({})
