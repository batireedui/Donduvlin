import React from 'react'
import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
const ContactScreen = () => {
    return (
        <View style={styles.main}>
            <View style={styles.items}>
                <TouchableOpacity style={{alignItems:'center'}} onPress={() => Linking.openURL('tel:7732-3399')}>
                    <Entypo name="phone" size={80} color="#0804db" />
                    <Text style={styles.txt}>7732-3399</Text>
                </TouchableOpacity>

            </View>

            <View style={styles.items [{ marginTop: 50, alignItems: 'center' }]}>
                <TouchableOpacity style={{alignItems:'center'}} onPress={() => Linking.openURL('https://uvgandan.mn')}>
                    <AntDesign name="chrome" size={70} color="#0804db" />
                    <Text style={styles.txt}>
                        www.uvgandan.mn
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ContactScreen

const styles = StyleSheet.create({
    txt: {
        color: '#0804db',
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 20
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
