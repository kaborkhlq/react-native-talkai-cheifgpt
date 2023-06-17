import { AppState, View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useEffect, useRef } from 'react';
import {  useFonts, Manjari_400Regular as Manjari, Manjari_700Bold as ManjariBold } from '@expo-google-fonts/manjari';
import { useAppOpenAd } from 'react-native-google-mobile-ads';
import AnimatedLottieView from 'lottie-react-native';

import useCustomerInfo from '../redux/useCustomerInfo';
import Config from '../redux/config'
import GlobalStyle from '../assets/values/global.style';
import useColors from '../assets/values/colors';
import { useState } from 'react';
const { width , height } = Dimensions.get('window');

const adUnit = Config.AppOpen.AdUnitID;
const requestOptions = {};

const SplashScreen = (props) => {
    const [Colors, GetColors] = useColors();
    const [fontsLoaded] = useFonts({Manjari, ManjariBold});
    const { isLoaded, isClosed, load, show } = useAppOpenAd(adUnit, requestOptions)
    const [gone, setGone] = useState(false);
    const [customerInfo, getCustomerInfo] = useCustomerInfo()
    const _lottieView = useRef();

    const styles = new StyleSheet.create({
        title: {
            fontSize: 55,
            color: Colors.mainGreen,
            fontFamily: 'Manjari'
        },
        image: {
            width: '80%',
            height: height * 0.5,
            resizeMode: 'contain'
        },
        label: {
            fontSize: 16,
            color: Colors.bgLight,
            fontFamily: 'Manjari'
        }
    });

    useEffect(() => {
        GetColors();
        _lottieView.current.play();
    }, [])
    useEffect(() => {
        load();
        getCustomerInfo();
    }, [load]);
    
    useEffect(() => {
        if (isClosed) {
            setGone(true);
            setTimeout(() => {
                props.navigation.replace('Introduction')
            }, 3000)
        }
    }, [isClosed]);

    useEffect(() => {
        if(customerInfo !== null && customerInfo.activeSubscriptions.length > 0) {
            setTimeout(() => {
                props.navigation.replace('Introduction')
            }, 3000)
        } else {
            if(isLoaded) {
                setTimeout(() => {
                    if(!gone) show();
                }, 3000)
            }
        }
    }, [isLoaded, customerInfo]);

    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, GlobalStyle.column, GlobalStyle.row_center, GlobalStyle.column_center]}>
            <Text style={[styles.title]}>Talk AI</Text>
            {/* <Image style={styles.image} source={require('../assets/drawables/splash_bg.png')} /> */}
            <AnimatedLottieView ref={_lottieView} style={{width: '80%'}} autoplay={true} loop={true}  source={require('../assets/splash_robot.json')} />
            <Text style={[styles.label]}>YOUR IDEAL ASSISTANT</Text>
            <Text style={[styles.label]}>IN ANY FIELD OF ACTIVITY</Text>
        </View>
    )
}

export default SplashScreen;