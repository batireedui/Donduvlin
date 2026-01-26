import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, BackHandler, Alert } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios'
import { checkConnected } from '../function';
import NoConnectionScreen from "./NoConnectionScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { serverUrl } from '../Consts'
import Spinning from '../components/Spinning'
const InsertOrderScreen = props => {
    const [info, setinfo] = useState(null);
    const [oldObj, setOldObj] = useState(null);
    const [connectStatus, setConnectStatus] = useState(false);

    checkConnected().then(res => {
        setConnectStatus(res)
    });


    useEffect(() => {
        let mount = true;
        let newObj = props.route.params;
        if (newObj !== oldObj) {
            setinfo("Дахин оролдоно уу!");
            setOldObj(props.route.params);
            console.log("!= -----****999");
        }
        else {
            setinfo("Дахин оролдоно уу!");

            console.log("== ------****999");
        }
        if (props.route.params.token !== null && props.route.params.hens !== null && props.route.params.hend !== null && props.route.params.utas !== null) {
            if (mount) {
                setOldObj(props.route.params);
                axios.post(serverUrl + 'insertapi.php',
                    {
                        "token": props.route.params.token,
                        "hens": props.route.params.hens,
                        "hend": props.route.params.hend,
                        "utas": props.route.params.utas,
                        "niitdun": props.route.params.une,
                        "zahid": props.route.params.zid
                    })
                    .then(data => {
                        if (data.data.indexOf("okok") > -1) {
                            props.navigation.navigate("SuccessScreen", { utga: data.data.substring(4, data.data.length), une: props.route.params.une })
                        }
                        else {
                            setinfo("Дахин оролдоно уу!");
                        }
                    })
                    .catch(err => { console.log(err); setinfo("Алдаа гарлаа! Дахин оролдоно уу.") });
            }
        }
        return () => {
            mount = false;
        }
    }, []);



    return (
        connectStatus ? (<View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
            {info === null ? <Spinning /> : (<View><Text style={{ textAlign: 'center' }}>{info}</Text></View>)}
        </View>) : (<NoConnectionScreen onCheck={checkConnected} />)
    )
}

export default InsertOrderScreen

const styles = StyleSheet.create({})
