import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import axios from 'axios'
import { serverUrl } from '../Consts'
import { checkConnected } from '../function';
import NoConnectionScreen from "./NoConnectionScreen";
import Spinning from '../components/Spinning'

const TodayScreen = () => {
    const [connectStatus, setConnectStatus] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setloading] = useState(false);
    checkConnected().then(res => {
        setConnectStatus(res)
    });
    useEffect(() => {
        setloading(true);
        let mount = true;
        axios.post(serverUrl + 'zurhai.php')
            .then(data => {
                if (mount) {
                    setData(data.data);
                    setloading(false);
                }
            })
            .catch(err => { setloading(false) });

        return () => {
            mount = false;
        };
    }, []);
    return (
        connectStatus ? (
        <View style={styles.main}>
            <ScrollView style={{margin: 15}}>
                <Text style={styles.txt}>Өнөөдрийн зурхай</Text>
                {loading && <Spinning/>}
                {
                    data !== null ?
                    data.map((e, index) => (
                        <View key={index}>
                        <Text key={e.title} style={styles.txtTitle}>{e.title}</Text>
                        <Text key={e.body} style={styles.txtBody}>{e.body}</Text>
                        </View>
                    )) : null
                }
            </ScrollView>       
        </View>) : (<NoConnectionScreen onCheck={checkConnected} />)
    )
}

export default TodayScreen

const styles = StyleSheet.create({
    txt: {
        color: '#00224f',
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 20,
        textAlign: 'center'
    },
    txtBody: {
        color: '#00224f',
        lineHeight: 20,
    },
    txtTitle: {
        color: '#00224f',
        fontWeight: 'bold',
        marginVertical: 15
    },
    main: {
        flex: 1,
        alignItems: 'center'
    }
})
