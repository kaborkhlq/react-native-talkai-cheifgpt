import {useEffect, useState} from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import useCustomerInfo from '../redux/useCustomerInfo';
import { useDispatch, useSelector } from 'react-redux';
import { useRewardedAd } from 'react-native-google-mobile-ads';
import { FontAwesome5 } from '@expo/vector-icons';

import { updateCredit } from '../redux/actions/auth.action';
import Config from '../redux/config';
import Colors from '../assets/values/colors';
import GlobalStyle from '../assets/values/global.style';
const {width, height} = Dimensions.get('window');

const adUnit = Config.Rewarded.AdUnitID;
const requestOptions = {};

const BottomNavigator = (props) => {
    const Auth = useSelector(state => state.AuthReducer)
    const dispatch = useDispatch();

    const onOpenChat = () => {
        const state = props.navigation.getState();
        if(state.routes[state.index].name !== 'ChatAI') {
            props.navigation.push('ChatAI');
        }
    }
    const onOpenPrompt = () => {
        const state = props.navigation.getState();
        if(state.routes[state.index].name !== 'PromptAI') {
            props.navigation.push('PromptAI');
        }
    }
    const onOpenWriter = () => {
        const state = props.navigation.getState();
        if(state.routes[state.index].name !== 'WriterAIHome') {
            props.navigation.push('WriterAIHome');
        }
    }
    const onOpenProfile= () => {
        const state = props.navigation.getState();
        if(state.routes[state.index].name !== 'Profile')
            props.navigation.push('Profile');
    }
    const onOpenIndex= () => {
        const state = props.navigation.getState();
        if(state.routes[state.index].name === 'PromptAI') {
            props?.onMagicShow();
        } else if(state.routes[state.index].name === 'PromptAIDetail') {
            props?.onMagicShow();
        } else if(state.routes[state.index].name !== 'Home')
            props.navigation.replace('Home');
    }

    return (
        <View style={[styles.footer]}>
            <Image style={[styles.bg]} source={require('../assets/drawables/tab_bar.png')} />
            <View style={[GlobalStyle.row, styles.toolbar]}>
                <View style={[GlobalStyle.row, {flex: 1, justifyContent: 'space-around'}]}>
                    <TouchableOpacity style={[styles.icon, GlobalStyle.row_center]} onPress={onOpenChat} >
                        {/* <Image source={require('../assets/drawables/ic_chat.png')} /> */}
                        <LottieView
                            style={{ width: 70,  backgroundColor: 'transparent', color: Colors.darkGreen }}
                            source={require('../assets/ic_chat.json')}
                            loop={true}
                            autoPlay
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.icon, GlobalStyle.row_center]} onPress={onOpenPrompt} >
                        {/* <Image tintColor={props.active === 'PromptAI' ? Colors.darkGreen : null} source={require('../assets/drawables/ic_prompt.png')} /> */}
                        <LottieView
                            style={{ width: 100,  backgroundColor: 'transparent', color: Colors.darkGreen }}
                            source={require('../assets/ic_image.json')}
                            loop={true}
                            autoPlay
                        />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}></View>
                <View style={[GlobalStyle.row, {flex: 1, justifyContent: 'space-around'}]}>
                    <TouchableOpacity style={[styles.icon, GlobalStyle.row_center]} onPress={onOpenWriter} >
                        {/* <Image tintColor={props.active === 'WriterAIHome' ? Colors.darkGreen : null} source={require('../assets/drawables/ic_writer.png')} /> */}
                        <LottieView
                            style={{ width: 100,  backgroundColor: 'transparent', color: Colors.darkGreen }}
                            source={require('../assets/ic_file.json')}
                            loop={true}
                            autoPlay
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.icon, GlobalStyle.row_center, { transform: [ { scale: 0.6 } ] }]} onPress={onOpenProfile} >
                        {/* <Image tintColor={props.active === 'Profile' ? Colors.darkGreen : null} source={require('../assets/drawables/ic_profile.png')} /> */}
                        <LottieView
                            style={{ width: 60,  backgroundColor: 'transparent', color: Colors.darkGreen }}
                            source={require('../assets/ic_profile.json')}
                            loop={true}
                            autoPlay
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Image style={[styles.homeButton]} source={require('../assets/drawables/btn_home.png')} />
                <TouchableOpacity style={{position: 'absolute', left: width / 2 - 35, bottom: height / 9 - 35, width: 70, height: 70}} onPress={onOpenIndex}>
                    {
                        props.navigation?.getState()?.routes[props.navigation.getState().index].name.indexOf('PromptAI') >= 0 ? (
                            <FontAwesome5 style={{position: 'absolute', left: 20, top: 10}} name="magic" size={30} color="white" />
                        ) : ( 
                            <LottieView
                                style={{ width: 70,  backgroundColor: 'transparent', color: Colors.darkGreen }}
                                source={require('../assets/ic_home.json')}
                                loop={true}
                                autoPlay
                            />
                        )
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = new StyleSheet.create({
    bg: {
        width: '100%',
        height: height / 9,
        resizeMode: 'stretch',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: width
    },
    homeButton: {
        width: width / 5,
        height: width / 5,
        position: 'absolute',
        left: width / 2 - width / 10,
        bottom: height / 9 - 30,
    },
    toolbar: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
    },
    icon: {
        transform: [
            { scale: 0.6 }
        ]
    }
});

export default BottomNavigator;