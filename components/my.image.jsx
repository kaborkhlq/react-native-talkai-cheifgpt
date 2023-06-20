import { useState, useEffect } from "react";
import {View, Image, StyleSheet, Text} from 'react-native'
import LottieView from 'lottie-react-native';
import JellyLoading from '../assets/jelly-loading.json'

const MyImage = (props) => {
    const [loading, setLoading] = useState(false)

    return (
        <View style={{position: 'relative'}}>
            <Image style={[props.style]} onLoadEnd={() => setLoading(false)} onLoadStart={() => setLoading(true)} source={{uri: props.uri}} />
            {loading && (
                <View style={{padding: 1, borderRadius: 50, backgroundColor: 'white', position:'absolute', left: 5, top: 5}}>
                    <LottieView
                        autoPlay
                        style={{width: 50}}
                        source={JellyLoading}
                    />
                </View>
            )}
        </View>
    )
}

export default MyImage