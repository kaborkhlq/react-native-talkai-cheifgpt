import React, {useEffect, useRef} from 'react';
import LottieView from 'lottie-react-native';
import { View, Text, StyleSheet, Dimensions, BackHandler, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useRewardedAd } from 'react-native-google-mobile-ads';

import useTrackEvent from '../../redux/useTrackEvent';
import useLicensePopup from '../../components/license.modal'
import { updateCredit } from '../../redux/actions/auth.action';
import BottomNavigator from '../../components/bottom.navigator';
import EditText from '../../components/edittext';
import GlobalStyle from '../../assets/values/global.style';
import useColors from '../../assets/values/colors';
import Button from '../../components/button';
import Config from '../../redux/config';
const {width, height} = Dimensions.get('window');

const adUnit = Config.Rewarded.AdUnitID;
const requestOptions = {};

const HomeScreen = (props) => {
    const [Colors, GetColors] = useColors()
    const AuthReducer = useSelector(state => state.AuthReducer);
    const dispatch = useDispatch();
    const [response, updateTrack] = useTrackEvent();
    const { isLoaded, isClosed, load, show, isEarnedReward, reward } = useRewardedAd(adUnit, requestOptions)

    const styles = new StyleSheet.create({
        container: {
            padding: 10,
        },  
        title: {
            fontSize: 35,
            color: Colors.mainGreen
        },
        hi: {
            color: Colors.mainGreen,
            fontSize: 15,
            marginLeft: 10,
        },
        hi_container: {
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#23DB77',
            backgroundColor: Colors.bgDark,
            paddingHorizontal: 20,
            paddingVertical: 12,
            height: '80%',
            borderRadius: 50,
        },
        label: {
            color: Colors.bgLight,
            fontSize: 16,
            marginTop: 50,
            marginBottom: 20,
        }
    });

    useEffect(() => {
        GetColors();
        console.log(AuthReducer.data);
        updateTrack()
    }, []);

    useEffect(() => {
        if(isEarnedReward) {
            dispatch(updateCredit(AuthReducer.data.uid, AuthReducer.data.credit + 1))
        }
    }, [isEarnedReward])

    useEffect(() => {
        if(isLoaded) show();
    }, [isLoaded])

    const onOpenChat = () => {
        props.navigation.push('ChatAI');
    }

    const onOpenPrompt = () => {
        props.navigation.push('PromptAI');
    }

    const onOpenWriter = () => {
        props.navigation.push('WriterAIHome');
    }

    const onOpenProfile= () => props.navigation.push('Profile');

    useEffect(() => {
        const backAction = () => {
            
        }

        const backHandler = BackHandler.addEventListener('hardwareBackPress',backAction);
        return () => backHandler.remove();
    }, [])

    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, styles.container, GlobalStyle.column_center]}>
            <View style={[GlobalStyle.row, { justifyContent: 'space-between', width: '100%' }]}>
                <Text style={[GlobalStyle.ManjariBold, styles.title]}>Talk AI</Text>
                <TouchableOpacity style={[GlobalStyle.row, GlobalStyle.column_center, styles.hi_container]} onPress={onOpenProfile}>
                    { AuthReducer.data.photo !== undefined && AuthReducer.data.photo !== null ?
                        (<Avatar.Image size={36} source={{uri: AuthReducer.data.photo}} />) :
                        (<Avatar.Text size={36} label={`${AuthReducer.data.username[0]}`} />)
                    }
                    <Text style={[GlobalStyle.Manjari, styles.hi]}>Hi, {AuthReducer.data.username}!</Text>
                </TouchableOpacity>
            </View>
            <EditText style={{marginTop: 20, opacity: 0}} editable={false} icon={require('../../assets/drawables/ic_search.png')} placeholder="Search.." />
            <View style={{position: 'relative'}}>
                <LottieView
                    autoPlay
                    style={{width: height / 5.5, height: height / 5.5, position: 'absolute', left: 0, top: 20, opacity: 0.4, transform: [ {scale: 1.2} ] }}
                    source={require('../../assets/wave-ring.json')}
                />
                <LottieView
                    autoPlay
                    style={{width: '100%', height: height / 5.5, marginTop: 20, transform: [ {scale: 1.3} ] }}
                    source={require('../../assets/chatgpt-robot1.json')}
                />
            </View>
            <Text style={[GlobalStyle.ManjariBold, styles.label]}>Generate a unique idea with Talk AI</Text>
            <Button width='90%' marginTop={10} bgColor={Colors.bgLight} title="Chat AI" titleColor={Colors.darkGreen} onPress={onOpenChat} />
            <Button width='90%' marginTop={10} bgColor={Colors.bgLight} title="AI Image" titleColor={Colors.darkGreen} onPress={onOpenPrompt} />
            <Button width='90%' marginTop={10} bgColor={Colors.bgLight} title="AI Writer" titleColor={Colors.darkGreen} onPress={onOpenWriter} />
            <BottomNavigator navigation={props.navigation} />
        </View>
    )
}

export default HomeScreen