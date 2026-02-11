import React from 'react'
import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
const ContactScreen = () => {
    return (
        <View style={styles.main}>
            <View style={styles.items}>
                <TouchableOpacity style={{alignItems:'center'}} onPress={() => Linking.openURL('tel:9906-8036')}>
                    <Entypo name="phone" size={99} color="#ca4e18" />
                    <Text style={styles.txt}>9906-8036</Text>
                </TouchableOpacity>

            </View>

            <View style={[styles.items, { marginTop: 50 }]}>
                <TouchableOpacity style={{alignItems:'center'}} onPress={() => Linking.openURL('https://donduvlin.mn')}>
                    <AntDesign name="chrome" size={99} color="#ca4e18" />
                    <Text style={styles.txt}>
                        www.donduvlin.mn
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ContactScreen

const styles = StyleSheet.create({
    txt: {
        color: '#ca4e18',
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 24
    },
    items: {
        alignItems: 'center'
    },
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
