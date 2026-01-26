import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview';
import { checkConnected } from '../function';
import NoConnectionScreen from "./NoConnectionScreen";

import Spinning from '../components/Spinning'
import { serverUrl } from '../Consts'
export default function HelpScreen() {
    const [connectStatus, setConnectStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    checkConnected().then(res => {
        setConnectStatus(res)
    });
    return (
        connectStatus ? (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff'}}>
                {loading ? <Spinning /> : null}
                <WebView source={{ uri: serverUrl + 'help.php' }}
                    javaScriptEnabled={true}
                    originWhitelist={['*']}
                    domStorageEnabled={true}
                    mixedContentMode='always'
                    renderError={(error) => console.log('error:', error)}
                    onLoadStart={() => setLoading(true)}
                    onLoad={() => setLoading(false)} />
            </View>) : (<NoConnectionScreen onCheck={checkConnected} />)
    )
}

const styles = StyleSheet.create({})
